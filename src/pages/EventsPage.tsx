import { useParams } from "react-router-dom"
import { useGoogleEvents } from "../hooks/useGoogleEvents"
import EventsByDate from "../components/EventsByDate"
import { assignColors } from "../helpers/colors.helper"
import settings from "../../settings"
import { useContext } from "react"
import { TokenContext } from "../contexts/TokenContext.ts"
import { MdOutlinePrint } from "react-icons/md"
import EventSummary from "../components/EventSummary.tsx"

export default function EventsPage() {
	const { year, month } = useParams()
	const parsedYear = Number(year)
	const parsedMonth = Number(month)
	const token = useContext(TokenContext)

	const {
		events,
		isLoading: eventsLoading,
		removeEventFromView,
	} = useGoogleEvents(token, parsedYear, parsedMonth)

	if (eventsLoading) {
		return <div>Caricamento in corso...</div>
	}

	const selectedEvents = events.filter((e) => {
		const rawDate = e.start.dateTime ?? e.start.date
		if (!rawDate) return false
		const date = new Date(rawDate)
		return date.getFullYear() === parsedYear && date.getMonth() + 1 === parsedMonth
	})

	const titles = Array.from(
		new Set(selectedEvents.map((e) => (e.summary || "(Senza titolo)").trim()))
	)
	const colorMap = assignColors(titles, settings.eventColors)

	return (
		<>
			<div className="max-w-3xl mx-auto mt-6">
				<h1 className="text-2xl font-bold mb-4">
					Eventi per {month}/{year}
				</h1>
				<EventSummary events={events} colorMap={colorMap} />
				<EventsByDate
					events={selectedEvents}
					colorMap={colorMap}
					onRemove={removeEventFromView}
				/>
			</div>
			<div className="fixed bottom-4 right-4 print:hidden">
				<button
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-lg cursor-pointer"
					onClick={() => window.print()}
				>
					<MdOutlinePrint />
				</button>
			</div>
		</>
	)
}
