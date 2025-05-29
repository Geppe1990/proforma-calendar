import React from "react"

const Loading: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center mt-20 text-center space-y-6">
			<p className="text-lg text-gray-600">Caricamento in corso...</p>
		</div>
	)
}

export default Loading
