import dayjs from "dayjs"
import type { CalendarEvent } from "../types/CalendarEvent.ts"

interface EventItemProps {
	event: CalendarEvent
}

export default function EventItem({ event }: EventItemProps) {
	const startRaw = event.start.dateTime || event.start.date
	const endRaw = event.end.dateTime || event.end.date

	const start = dayjs(startRaw)
	const end = dayjs(endRaw)

	const time = event.start.dateTime ? start.format("HH:mm") : "Tutto il giorno"

	let duration = "-"
	if (event.start.dateTime && event.end.dateTime) {
		const minutes = end.diff(start, "minute")
		const h = Math.floor(minutes / 60)
		const m = minutes % 60
		duration = h > 0 && m > 0 ? `${h}h ${m}min` : h > 0 ? `${h}h` : `${m}min`
	}

	return (
		<div className={"print:flex print:items-center print:justify-between print:w-full"}>
			<div className="font-medium">{event.summary || "(Senza titolo)"}</div>
			<div className="text-sm text-gray-600 print:hidden">
				{time} · Durata: {duration}
			</div>
			<div className={"hidden print:block"}>Durata: {duration}</div>
		</div>
	)
}
