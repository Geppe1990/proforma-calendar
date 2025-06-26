import { MdUndo } from "react-icons/md"

export function RestoreHiddenEventsButton() {
	const handleClick = () => {
		localStorage.removeItem("hiddenEvents")
		location.reload()
	}

	return (
		<button
			onClick={handleClick}
			className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors shadow-md cursor-pointer print:hidden"
		>
			<MdUndo className="w-5 h-5" />
			Ripristina eventi nascosti
		</button>
	)
}
