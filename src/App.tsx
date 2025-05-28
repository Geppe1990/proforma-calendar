import { useGoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react"
import dayjs from "dayjs"

interface CalendarEvent {
	id: string
	summary: string
	start: { dateTime?: string; date?: string }
	end: { dateTime?: string; date?: string }
}

export default function App() {
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [events, setEvents] = useState<CalendarEvent[]>([])

	const login = useGoogleLogin({
		scope: "https://www.googleapis.com/auth/calendar.readonly",
		onSuccess: async (tokenResponse) => {
			const token = tokenResponse.access_token
			localStorage.setItem("google_token", token)
			setAccessToken(token)
			await fetchEvents(token)
		},
		onError: (err) => console.error("Login Failed:", err),
	})

	const fetchEvents = async (token: string) => {
		const now = dayjs()
		const start = now.startOf("month").toISOString()
		const end = now.endOf("month").toISOString()

		const res = await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)

		const data = await res.json()
		setEvents(data.items || [])
	}

	useEffect(() => {
		const token = localStorage.getItem("google_token")
		if (token) {
			setAccessToken(token)
			fetchEvents(token)
		}
	}, [])

	// Raggruppa eventi per data
	const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
		const start = dayjs(event.start.dateTime || event.start.date).format("YYYY-MM-DD")
		if (!acc[start]) acc[start] = []
		acc[start].push(event)
		return acc
	}, {})

	// Ordina le date in ordine crescente
	const sortedDates = Object.keys(eventsByDate).sort()

	return (
		<div className="p-6 max-w-3xl mx-auto">
			{!accessToken ? (
				<button
					onClick={() => login()}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					Login con Google
				</button>
			) : (
				<>
					<h1 className="text-2xl font-bold mb-4">
						Eventi di {dayjs().format("MMMM YYYY")}
					</h1>
					{sortedDates.length === 0 ? (
						<p>Nessun evento trovato per questo mese.</p>
					) : (
						sortedDates.map((date) => (
							<div key={date} className="mb-6">
								<h2 className="text-xl font-semibold mb-2">
									{dayjs(date).format("dddd D MMMM YYYY")}
								</h2>
								<ul className="space-y-2">
									{eventsByDate[date].map((event) => {
										const startRaw = event.start.dateTime || event.start.date
										const endRaw = event.end.dateTime || event.end.date
										const start = dayjs(startRaw)
										const end = dayjs(endRaw)
										const time = event.start.dateTime
											? start.format("HH:mm")
											: "Tutto il giorno"

										// Calcola la durata
										let duration = "-"
										if (event.start.dateTime && event.end.dateTime) {
											const minutes = end.diff(start, "minute")
											const h = Math.floor(minutes / 60)
											const m = minutes % 60
											duration =
												h > 0 && m > 0
													? `${h}h ${m}min`
													: h > 0
														? `${h}h`
														: `${m}min`
										}

										return (
											<li
												key={event.id}
												className="border p-4 rounded shadow-sm hover:bg-gray-50"
											>
												<div className="font-medium">
													{event.summary || "(Senza titolo)"}
												</div>
												<div className="text-sm text-gray-600">
													{time} · Durata: {duration}
												</div>
											</li>
										)
									})}
								</ul>
							</div>
						))
					)}
				</>
			)}
		</div>
	)
}
