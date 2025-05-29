export function capitalizeFirstLetter(str: string) {
	const parts = str.split(" ")
	if (parts.length >= 3) {
		parts[0] = parts[0][0].toUpperCase() + parts[0].slice(1)
		parts[2] = parts[2][0].toUpperCase() + parts[2].slice(1)
	}
	return parts.join(" ")
}
