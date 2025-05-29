import { useEffect, useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"

export function useGoogleAuth(onTokenReady: (token: string) => void) {
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const login = useGoogleLogin({
		scope: "https://www.googleapis.com/auth/calendar.readonly",
		onSuccess: async (tokenResponse) => {
			const token = tokenResponse.access_token
			localStorage.setItem("google_token", token)
			setAccessToken(token)
			onTokenReady(token)
		},
		onError: (err) => console.error("Login Failed:", err),
	})

	useEffect(() => {
		const token = localStorage.getItem("google_token")
		if (token) {
			fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
				.then((res) => {
					if (!res.ok) throw new Error("Token scaduto")
					setAccessToken(token)
					onTokenReady(token)
				})
				.catch(() => {
					localStorage.removeItem("google_token")
					setAccessToken(null)
				})
				.finally(() => {
					setIsLoading(false)
				})
		} else {
			setIsLoading(false)
		}
	}, [onTokenReady])

	return { accessToken, isLoading, login }
}
