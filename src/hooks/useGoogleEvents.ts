import { useEffect, useState } from "react"
import dayjs from "dayjs"
import type { CalendarEvent } from "../types/CalendarEvent"

const STORAGE_KEY = "hiddenEvents"

function getHiddenEvents(): Record<string, { year: string; month: string }> {
	const raw = localStorage.getItem(STORAGE_KEY)
	return raw ? JSON.parse(raw) : {}
}

function saveHiddenEvents(data: Record<string, { year: string; month: string }>) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useGoogleEvents(token: string | null, year: number, month: number) {
	const [events, setEvents] = useState<CalendarEvent[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const monthStr = String(month).padStart(2, "0")
	const yearStr = String(year)

	useEffect(() => {
		const fetchEvents = async () => {
			if (!token || !year || !month) return

			const start = dayjs(`${year}-${month}-01`).startOf("month").toISOString()
			const end = dayjs(`${year}-${month}-01`).endOf("month").toISOString()

			try {
				const res = await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`,
					{ headers: { Authorization: `Bearer ${token}` } }
				)

				if (res.status === 401) {
					console.warn("Token non valido.")
					localStorage.removeItem("google_token")
					setEvents([])
					return
				}

				const data = await res.json()
				const hidden = getHiddenEvents()
				const visibleEvents = (data.items || []).filter((event: CalendarEvent) => {
					const startTime = event.start?.dateTime ?? event.start?.date
					if (!event.id || !startTime) return true
					const key = `${event.id}_${startTime.replaceAll(":", "").replaceAll("-", "")}`
					const hiddenEntry = hidden[key]
					return !(
						hiddenEntry &&
						hiddenEntry.year === String(year) &&
						hiddenEntry.month === String(month)
					)
				})

				setEvents(visibleEvents)
			} catch (error) {
				console.error("Errore nel recupero eventi:", error)
			} finally {
				setIsLoading(false)
			}
		}

		setIsLoading(true)
		void fetchEvents()

		return () => {
			setEvents([])
			setIsLoading(true)
		}
	}, [token, year, month])

	const removeEventFromView = (event: CalendarEvent) => {
		const hidden = getHiddenEvents()
		const startTime = event.start?.dateTime ?? event.start?.date
		if (!event.id || !startTime) return
		const key = `${event.id}_${startTime.replaceAll(":", "").replaceAll("-", "")}`

		hidden[key] = { year: yearStr, month: monthStr }
		saveHiddenEvents(hidden)
		setEvents((prev) =>
			prev.filter(
				(e) => e.id !== event.id || (e.start?.dateTime ?? e.start?.date) !== startTime
			)
		)
	}

	const restoreHiddenEvents = () => {
		const hidden = getHiddenEvents()
		const updated = Object.fromEntries(
			Object.entries(hidden).filter(
				([, meta]) => meta.year !== yearStr || meta.month !== monthStr
			)
		)
		saveHiddenEvents(updated)
	}

	return { events, isLoading, removeEventFromView, restoreHiddenEvents }
}
