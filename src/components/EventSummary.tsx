import type { CalendarEvent } from "../types/CalendarEvent.ts"
import dayjs from "dayjs"
import settings from "../../settings.ts"

interface EventSummaryProps {
	events: CalendarEvent[]
	colorMap: Record<string, string>
}

export default function EventSummary({ events, colorMap }: EventSummaryProps) {
	const durations: Record<string, number> = {}
	const titlesMap: Record<string, string> = {}

	if (!events) return <></>

	events.forEach((event) => {
		const rawTitle = event.summary || "(Senza titolo)"
		const normalizedTitle = rawTitle.trim()

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
	if (summaries.length === 0) return <></>

	const totalMinutes = summaries.reduce((acc, [, min]) => acc + min, 0)
	const totalHours = totalMinutes / 60
	const totalFormatted = (() => {
		const h = Math.floor(totalMinutes / 60)
		const m = totalMinutes % 60
		return h > 0 && m > 0 ? `${h}h ${m}min` : h > 0 ? `${h}h` : `${m}min`
	})()

	const compensoTotale = (totalHours * settings.rate).toFixed(2)

	return (
		<div>
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
					const bgColor = colorMap[normalizedTitle]
					return (
						<li
							key={normalizedTitle}
							style={{
								backgroundColor: bgColor,
							}}
							className={`p-2 rounded`}
						>
							{displayTitle}:&nbsp;<b>{formatted}</b>
						</li>
					)
				})}
				<li className="mt-4 font-semibold text-black border-t pt-2">
					Totale ore: <b>{totalFormatted}</b>
				</li>
				<li className="text-black border-b pb-2">
					Compenso: <b>{compensoTotale} €</b>
				</li>
			</ul>
		</div>
	)
}
