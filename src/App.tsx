import { useGoogleLogin } from "@react-oauth/google"
import { useState } from "react"
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
					{events.length === 0 ? (
						<p>Nessun evento trovato per questo mese.</p>
					) : (
						<table className="table-auto w-full border">
							<thead>
								<tr className="bg-gray-100">
									<th className="px-4 py-2 border">Data</th>
									<th className="px-4 py-2 border">Ora</th>
									<th className="px-4 py-2 border">Titolo</th>
								</tr>
							</thead>
							<tbody>
								{events.map((event) => {
									console.log("events", events)
									const start = event.start.dateTime || event.start.date
									const formattedDate = dayjs(start).format("DD/MM/YYYY")
									const formattedTime = event.start.dateTime
										? dayjs(start).format("HH:mm")
										: "Tutto il giorno"
									return (
										<tr key={event.id} className="hover:bg-gray-50">
											<td className="border px-4 py-2">{formattedDate}</td>
											<td className="border px-4 py-2">{formattedTime}</td>
											<td className="border px-4 py-2">
												{event.summary || "(Senza titolo)"}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					)}
				</>
			)}
		</div>
	)
}
