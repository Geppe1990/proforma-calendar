import type { CalendarEvent } from "../App"
import dayjs from "dayjs"

interface EventSummaryProps {
	events: CalendarEvent[]
}

export default function EventSummary({ events }: EventSummaryProps) {
	const durations: Record<string, number> = {}
	const titlesMap: Record<string, string> = {}

	events.forEach((event) => {
		const rawTitle = event.summary || "(Senza titolo)"
		const normalizedTitle = rawTitle.trim()

		// Salva la versione originale solo la prima volta (per visualizzarla correttamente)
		if (!titlesMap[normalizedTitle]) {
			titlesMap[normalizedTitle] = rawTitle
		}

		const start = event.start.dateTime
		const end = event.end.dateTime

		if (start && end) {
			const startTime = dayjs(start)
			const endTime = dayjs(end)
			const durationMinutes = endTime.diff(startTime, "minute")
			durations[normalizedTitle] = (durations[normalizedTitle] || 0) + durationMinutes
		}
	})

	const summaries = Object.entries(durations)

	if (summaries.length === 0) return null

	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold mb-2">Tempo totale per evento</h2>
			<ul className="space-y-1 text-gray-800">
				{summaries.map(([normalizedTitle, minutes]) => {
					const displayTitle = titlesMap[normalizedTitle]
					const hours = Math.floor(minutes / 60)
					const mins = minutes % 60
					const formatted =
						hours > 0 && mins > 0
							? `${hours}h ${mins}min`
							: hours > 0
								? `${hours}h`
								: `${mins}min`

					return (
						<li key={normalizedTitle}>
							{displayTitle}: {formatted}
						</li>
					)
				})}
			</ul>
		</div>
	)
}
