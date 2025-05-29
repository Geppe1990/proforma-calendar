import { useNavigate } from "react-router-dom"
import React, { useState } from "react"

export default function HomePage() {
	const navigate = useNavigate()
	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth() + 1

	const [year, setYear] = useState(currentYear)
	const [month, setMonth] = useState(currentMonth)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		navigate(`/${year}/${String(month).padStart(2, "0")}`)
	}

	return (
		<div className="max-w-md mx-auto mt-20">
			<h1 className="text-2xl font-bold mb-4">Seleziona mese e anno</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block mb-1">Anno</label>
					<input
						type="number"
						value={year}
						onChange={(e) => setYear(Number(e.target.value))}
						className="border p-2 w-full"
						min="2000"
						max="2100"
					/>
				</div>
				<div>
					<label className="block mb-1">Mese</label>
					<select
						value={month}
						onChange={(e) => setMonth(Number(e.target.value))}
						className="border p-2 w-full"
					>
						{Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
							<option key={m} value={m}>
								{m.toString().padStart(2, "0")}
							</option>
						))}
					</select>
				</div>
				<button className="bg-blue-600 text-white px-4 py-2 rounded">Cerca</button>
			</form>
		</div>
	)
}
