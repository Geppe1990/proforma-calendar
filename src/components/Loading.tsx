import React from "react"

const Loading: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center text-center h-full absolute top-0 left-[50%]">
			<svg
				className="animate-spin h-8 w-8"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					className="opacity-25 text-gray-400"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75 text-blue-600"
					fill="currentColor"
					d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
				/>
			</svg>
		</div>
	)
}

export default Loading
