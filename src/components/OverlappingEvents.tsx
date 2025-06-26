import dayjs from "dayjs"
import type { CalendarEvent } from "../types/CalendarEvent.ts"

interface OverlappingEventsProps {
	events: CalendarEvent[]
}

function areOverlapping(a: CalendarEvent, b: CalendarEvent) {
	const startA = dayjs(a.start.dateTime ?? a.start.date)
	const endA = dayjs(a.end?.dateTime ?? a.end?.date ?? a.start.dateTime ?? a.start.date)
	const startB = dayjs(b.start.dateTime ?? b.start.date)
	const endB = dayjs(b.end?.dateTime ?? b.end?.date ?? b.start.dateTime ?? b.start.date)

	return startA.isBefore(endB) && endA.isAfter(startB)
}

export default function OverlappingEvents({ events }: OverlappingEventsProps) {
	const overlaps: [CalendarEvent, CalendarEvent][] = []

	for (let i = 0; i < events.length; i++) {
		for (let j = i + 1; j < events.length; j++) {
			if (areOverlapping(events[i], events[j])) {
				overlaps.push([events[i], events[j]])
			}
		}
	}

	if (overlaps.length === 0) {
		return null
	}

	return (
		<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			<h2 className="font-bold mb-2">⚠️ Eventi sovrapposti trovati:</h2>
			<ul className="space-y-2 text-sm">
				{overlaps.map(([a, b], idx) => (
					<li key={idx}>
						<strong>{a.summary || "Senza titolo"}</strong> e{" "}
						<strong>{b.summary || "Senza titolo"}</strong>
					</li>
				))}
			</ul>
		</div>
	)
}
