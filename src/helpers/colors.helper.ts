export function assignColors(titles: string[], colors: string[]): Record<string, string> {
	const map: Record<string, string> = {}
	titles.forEach((title, index) => {
		map[title] = colors[index % colors.length]
	})
	return map
}
