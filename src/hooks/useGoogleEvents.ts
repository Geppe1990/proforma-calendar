import { useEffect, useState } from "react"
import dayjs from "dayjs"
import type { CalendarEvent } from "../types/CalendarEvent"

export function useGoogleEvents(token: string | null, year: number, month: number) {
	const [events, setEvents] = useState<CalendarEvent[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const fetchEvents = async (token: string, year: number, month: number) => {
		const start = dayjs(`${year}-${String(month).padStart(2, "0")}-01`)
			.startOf("month")
			.toISOString()
		const end = dayjs(`${year}-${String(month).padStart(2, "0")}-01`)
			.endOf("month")
			.toISOString()

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
		if (token && year && month) {
			fetchEvents(token, year, month).finally(() => setIsLoading(false))
		} else {
			setIsLoading(false)
		}

		return () => {
			setEvents([])
			setIsLoading(true)
		}
	}, [token, year, month])

	const removeEventFromView = (id: string) => {
		setEvents((prev) => prev.filter((e) => e.id !== id))
	}

	return { events, isLoading, removeEventFromView }
}
