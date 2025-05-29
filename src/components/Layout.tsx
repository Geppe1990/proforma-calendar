import { Outlet } from "react-router-dom"
import { IoMdHeart } from "react-icons/io"
import LoginButton from "./LoginButton.tsx"
import { useState } from "react"
import { useGoogleAuth } from "../hooks/useGoogleAuth.ts"
import { TokenContext } from "../contexts/TokenContext.ts"

export default function Layout() {
	const [token, setToken] = useState<string | null>(null)
	const { accessToken, isLoading: authLoading, login } = useGoogleAuth(setToken)
	if (authLoading) {
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
		<TokenContext.Provider value={token}>
			<div className="min-h-screen flex flex-col">
				<header className="bg-blue-600 text-white p-4">
					<h1 className="text-2xl font-bold">Proforma Generator</h1>
				</header>

				<main className="flex-grow container mx-auto p-4">
					<Outlet />
				</main>

				<footer className="bg-gray-100 text-center text-sm text-gray-500 p-4">
					<div className={"flex justify-center items-center"}>
						&copy; {new Date().getFullYear()} Made with&nbsp;
						<IoMdHeart className={"text-red-600"} />
						&nbsp;by&nbsp;
						<a href="https://www.linkedin.com/in/giuseppevigneri/">Giuseppe Vigneri</a>
					</div>
				</footer>
			</div>
		</TokenContext.Provider>
	)
}
