import { useEffect, useState } from "react"
import dayjs from "dayjs"
import type { CalendarEvent } from "../types/CalendarEvent"

export function useGoogleEvents(accessToken: string | null) {
	const [events, setEvents] = useState<CalendarEvent[]>([])
	const [isLoading, setIsLoading] = useState(true)

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
				console.warn("Token non valido.")
				localStorage.removeItem("google_token")
				return setEvents([])
			}

			const data = await res.json()
			setEvents(data.items || [])
		} catch (error) {
			console.error("Errore nel recupero eventi:", error)
		}
	}

	useEffect(() => {
		if (accessToken) {
			fetchEvents(accessToken).finally(() => setIsLoading(false))
		} else {
			setIsLoading(false)
		}
	}, [accessToken])

	const removeEventFromView = (id: string) => {
		setEvents((prev) => prev.filter((e) => e.id !== id))
	}

	return { events, isLoading, removeEventFromView }
}
