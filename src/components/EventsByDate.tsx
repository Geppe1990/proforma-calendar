import dayjs from "dayjs"
import EventItem from "./EventItem"
import type { CalendarEvent } from "../types/CalendarEvent.ts"
import { MdClose } from "react-icons/md"

interface EventsByDateProps {
	events: CalendarEvent[]
	colorMap: Record<string, string>
	onRemove: (id: string) => void
}
export default function EventsByDate({ events, colorMap, onRemove }: EventsByDateProps) {
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
									className={`p-2 rounded hover:bg-gray-50 flex justify-between ${bgColor}`}
								>
									<EventItem event={event} />
									<button
										onClick={() => onRemove(event.id)}
										className="text-sm text-red-600 hover:text-red-800 cursor-pointer print:hidden"
									>
										<MdClose />
									</button>
								</li>
							)
						})}
					</ul>
				</div>
			))}
		</>
	)
}
