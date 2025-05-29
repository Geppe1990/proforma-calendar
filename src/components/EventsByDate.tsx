import dayjs from "dayjs"
import EventItem from "./EventItem"
import type { CalendarEvent } from "../App.tsx"

interface EventsByDateProps {
	events: CalendarEvent[]
	colorMap: Record<string, string>
}

export default function EventsByDate({ events, colorMap }: EventsByDateProps) {
	const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
		const start = dayjs(event.start.dateTime || event.start.date).format("YYYY-MM-DD")
		if (!acc[start]) acc[start] = []
		acc[start].push(event)
		return acc
	}, {})

	const sortedDates = Object.keys(eventsByDate).sort()

	if (sortedDates.length === 0) {
		return <p>Nessun evento trovato per questo mese.</p>
	}

	return (
		<>
			<h2 className={"text-xl font-semibold mb-2"}>Calendario</h2>
			{sortedDates.map((date) => (
				<div key={date} className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{dayjs(date).format("dddd D MMMM YYYY")}
					</h2>
					<ul className="space-y-2">
						{eventsByDate[date].map((event) => {
							const normalizedTitle = (event.summary || "(Senza titolo)").trim()
							const bgColor = colorMap[normalizedTitle] || "bg-gray-100"
							return (
								<li
									key={event.id}
									className={`p-2 rounded hover:bg-gray-50 ${bgColor} print:flex print:items-center print:p-0 print:mb-2`}
								>
									<EventItem event={event} />
								</li>
							)
						})}
					</ul>
				</div>
			))}
		</>
	)
}
