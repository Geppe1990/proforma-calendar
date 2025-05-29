import { Outlet } from "react-router-dom"
import { useState } from "react"
import { useGoogleAuth } from "../hooks/useGoogleAuth.ts"
import { TokenContext } from "../contexts/TokenContext.ts"
import Login from "./Login.tsx"
import Loading from "./Loading.tsx"
import Header from "./Header.tsx"
import Footer from "./Footer.tsx"
import Navbar from "../Navbar.tsx"
import NavbarAlert from "./NavbarAlert.tsx"

export default function Layout() {
	const [token, setToken] = useState<string | null>(null)
	const { accessToken, isLoading: authLoading, login } = useGoogleAuth(setToken)
	if (authLoading) {
		return <Loading />
	}

	if (!accessToken) {
		return <Login callback={login} />
	}
	return (
		<TokenContext.Provider value={token}>
			<div className="min-h-screen flex flex-col">
				<NavbarAlert />
				<Header />
				<Navbar />
				<main className="flex-grow container mx-auto p-4">
					<Outlet />
				</main>
				<Footer />
			</div>
		</TokenContext.Provider>
	)
}
