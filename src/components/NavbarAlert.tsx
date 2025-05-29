import settings from "../../settings.ts"
import { useState } from "react"
import { MdClose } from "react-icons/md"

const NavbarAlert = () => {
	const [opened, setOpened] = useState<boolean>(!settings.firstName && !settings.lastName)

	const handleClose = () => {
		setOpened(false)
	}

	if (!opened) {
		return
	}

	return (
		<div
			className={
				"bg-red-600 text-white text-left p-2 text-sm flex justify-between items-center"
			}
		>
			<div>
				<b>🔥 Attenzione</b>: se è la prima volta che usi questa applicazione, modifica i
				parametri nel file settings.json
			</div>
			<div className={"text-white cursor-pointer"} onClick={handleClose}>
				<MdClose />
			</div>
		</div>
	)
}

export default NavbarAlert
