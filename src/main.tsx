import ReactDOM from "react-dom/client"
import { GoogleOAuthProvider } from "@react-oauth/google"
const clientId = import.meta.env.VITE_CLIENT_ID
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import EventsPage from "./pages/EventsPage"
import "./index.css"
import Layout from "./components/Layout.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<GoogleOAuthProvider clientId={clientId}>
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/:year/:month" element={<EventsPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</GoogleOAuthProvider>
)
