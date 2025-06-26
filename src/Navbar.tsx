import { useNavigate, useParams } from "react-router-dom"
import { MdArrowBack, MdArrowForward } from "react-icons/md"
import dayjs from "dayjs"
import "dayjs/locale/it"

export default function Navbar() {
	const navigate = useNavigate()
	const { year, month } = useParams()

	const current = dayjs(`${year}-${month}-01`)

	const handleChangeMonth = (delta: number) => {
		const newDate = current.add(delta, "month")
		const newYear = newDate.year()
		const newMonth = String(newDate.month() + 1).padStart(2, "0")
		navigate(`/${newYear}/${newMonth}`)
	}
	let formattedMonth = current.locale("it").format("MMMM YYYY")
	formattedMonth =
		String(formattedMonth).charAt(0).toUpperCase() + String(formattedMonth).slice(1)
	return (
		<nav className="bg-gray-100 py-2 px-4 flex justify-between items-center print:hidden">
			<button
				onClick={() => handleChangeMonth(-1)}
				className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer"
			>
				<MdArrowBack />
				Mese precedente
			</button>
			<div className="text-lg font-medium">{formattedMonth}</div>
			<button
				onClick={() => handleChangeMonth(1)}
				className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer"
			>
				Mese successivo
				<MdArrowForward />
			</button>
		</nav>
	)
}
