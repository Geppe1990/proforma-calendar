import "./App.css"
import { useGoogleCalendar } from "./hooks/useGoogleCalendar"
import EventsByDate from "./components/EventsByDate"
import LoginButton from "./components/LoginButton"
import EventSummary from "./components/EventSummary"
import NavbarAlert from "./components/NavbarAlert"
import { MdOutlinePrint } from "react-icons/md"
import dayjs from "dayjs"
import "dayjs/locale/it"
import settings from "../settings.ts"
import { assignColors } from "./helpers/colors.helper"

dayjs.locale("it")

export default function App() {
	const { accessToken, isLoading, events, login, removeEventFromView } = useGoogleCalendar()

	const titles = Array.from(new Set(events.map((e) => (e.summary || "(Senza titolo)").trim())))
	const colorMap = assignColors(titles, settings.eventColors)

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center mt-20 text-center space-y-6">
				<p className="text-lg text-gray-600">Caricamento in corso...</p>
			</div>
		)
	}

	if (!accessToken) {
		return (
			<div className="flex flex-col items-center justify-center mt-20 text-center space-y-6">
				<h1 className="text-4xl font-bold">Benvenuto!</h1>
				<p className="text-lg text-gray-600 max-w-md">
					Accedi con Google per generare automaticamente un proforma basata sui tuoi
					eventi del calendario.
				</p>
				<LoginButton onClick={login} />
			</div>
		)
	}

	return (
		<>
			<NavbarAlert />
			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">
					Proforma {settings.firstName} {settings.lastName} {dayjs().format("MMMM YYYY")}
				</h1>
				<EventSummary events={events} colorMap={colorMap} />
				<div className="mt-6">
					<EventsByDate
						events={events}
						colorMap={colorMap}
						onRemove={removeEventFromView}
					/>
				</div>
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
