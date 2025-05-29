import { useEffect, useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import dayjs from "dayjs"
import type { CalendarEvent } from "../types/CalendarEvent.ts"

export function useGoogleCalendar() {
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [events, setEvents] = useState<CalendarEvent[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const login = useGoogleLogin({
		scope: "https://www.googleapis.com/auth/calendar.readonly",
		onSuccess: async (tokenResponse) => {
			const token = tokenResponse.access_token
			localStorage.setItem("google_token", token)
			setAccessToken(token)
			await fetchEvents(token)
		},
		onError: (err) => console.error("Login Failed:", err),
	})

	const fetchEvents = async (token: string) => {
		const now = dayjs()
		const start = now.startOf("month").toISOString()
		const end = now.endOf("month").toISOString()

		try {
			const res = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`,
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			if (res.status === 401) {
				console.warn("Token non valido. Rimuovo e richiedo login.")
				localStorage.removeItem("google_token")
				setAccessToken(null)
				setEvents([])
				return
			}

			const data = await res.json()
			setEvents(data.items || [])
		} catch (error) {
			console.error("Errore nel recupero eventi:", error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem("google_token")
		if (token) {
			fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
				.then((res) => {
					if (!res.ok) throw new Error("Token scaduto")
					setAccessToken(token)
					return fetchEvents(token)
				})
				.catch(() => {
					localStorage.removeItem("google_token")
					setAccessToken(null)
				})
				.finally(() => {
					setIsLoading(false)
				})
		} else {
			setIsLoading(false)
		}
	}, [])

	const removeEventFromView = (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id))

	return { accessToken, isLoading, events, login, removeEventFromView }
}
