import { useGoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import EventsByDate from "./components/EventsByDate"
import LoginButton from "./components/LoginButton"

export interface CalendarEvent {
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

	return (
		<div className="p-6 max-w-3xl mx-auto">
			{!accessToken ? (
				<LoginButton onClick={login} />
			) : (
				<>
					<h1 className="text-2xl font-bold mb-4">
						Eventi di {dayjs().format("MMMM YYYY")}
					</h1>
					<EventsByDate events={events} />
				</>
			)}
		</div>
	)
}
