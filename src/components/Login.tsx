import LoginButton from "./LoginButton.tsx"
import React from "react"
import type { OverridableTokenClientConfig } from "@react-oauth/google"

interface LoginProps {
	callback: (overrideConfig?: OverridableTokenClientConfig | undefined) => void
}

const Login: React.FC<LoginProps> = ({ callback }) => {
	return (
		<div className="flex flex-col items-center justify-center mt-20 text-center space-y-6">
			<h1 className="text-4xl font-bold">Benvenuto!</h1>
			<p className="text-lg text-gray-600 max-w-md">
				Accedi con Google per generare automaticamente un proforma basato sul tuo
				calendario.
			</p>
			<LoginButton onClick={callback} />
		</div>
	)
}

export default Login
