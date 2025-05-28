import { useGoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/it"
import EventsByDate from "./components/EventsByDate"
import LoginButton from "./components/LoginButton"
import EventSummary from "./components/EventSummary.tsx"
import "./App.css"
import settings from "../settings.ts"

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
		dayjs.locale("it")
		const now = dayjs()
		const start = now.startOf("month").toISOString()
		const end = now.endOf("month").toISOString()

		try {
			const res = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (res.status === 401) {
				// Token non valido o scaduto
				console.warn("Token non valido. Rimuovo e richiedo login.")
				localStorage.removeItem("google_token")
				setAccessToken(null)
				setEvents([])
				return
			}

			const data = await res.json()
			setEvents(data.items || [])
		} catch (error) {
			console.error("Errore nel recupero eventi:", error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem("google_token")
		if (token) {
			// Verifica validità del token
			fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
				.then((res) => {
					if (!res.ok) throw new Error("Token scaduto")
					setAccessToken(token)
					fetchEvents(token)
				})
				.catch(() => {
					localStorage.removeItem("google_token")
					setAccessToken(null)
				})
		}
	}, [])

	return (
		<div className="max-w-3xl mx-auto">
			{!accessToken ? (
				<LoginButton onClick={login} />
			) : (
				<>
					<h1 className={"text-3xl font-bold mb-6"}>
						Proforma {settings.firstName} {settings.lastName}{" "}
						{dayjs().format("MMMM YYYY")}
					</h1>
					<div className="flex justify-between gap-8 flex-col md:flex-row">
						<div className="flex-1">
							<EventsByDate events={events} />
						</div>
						<div className="flex-1">
							<EventSummary events={events} />
						</div>
					</div>
				</>
			)}
		</div>
	)
}
