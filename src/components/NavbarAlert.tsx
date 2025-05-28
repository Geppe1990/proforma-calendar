import settings from "../../settings.ts"

const NavbarAlert = () => {
	if (!(!settings.firstName && !settings.lastName)) {
		return
	}
	return (
		<div className={"bg-red-600 text-white text-left p-2 mb-4 text-sm"}>
			<b>Attenzione</b>: se è la prima volta che usi questa applicazione, modifica i parametri
			nel file settings.json
		</div>
	)
}

export default NavbarAlert
