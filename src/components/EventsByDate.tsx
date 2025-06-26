import dayjs from "dayjs"
import "dayjs/locale/it"
dayjs.locale("it")

import EventItem from "./EventItem"
import type { CalendarEvent } from "../types/CalendarEvent.ts"
import { MdClose } from "react-icons/md"
import { capitalizeFirstLetter } from "../helpers/capitalize.helper.ts"

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
	return (
		<>
			<h2 className={"text-3xl font-semibold mt-6 mb-2"}>Calendario</h2>
			{sortedDates.map((date) => (
				<div key={date} className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{capitalizeFirstLetter(dayjs(date).format("dddd D MMMM YYYY"))}
					</h2>
					<ul className="space-y-2">
						{eventsByDate[date].map((event) => {
							const normalizedTitle = (event.summary || "(Senza titolo)").trim()
							const bgColor = colorMap[normalizedTitle]
							return (
								<li
									key={event.id}
									style={{ backgroundColor: bgColor }}
									className="p-2 rounded hover:bg-gray-50 flex justify-between print:p-0 print:border print:border-t-0 print:border-x-0 print:rounded-none"
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
