const Header = () => {
	return (
		<header className="bg-blue-600 text-white p-4">
			<h1 className="text-2xl font-bold">
				<a className={"print:hidden"} href="/">
					Proforma Generator
				</a>
				<span className={"hidden print:block"}>
					Proforma {import.meta.env.VITE_CLIENT_FIRSTNAME}{" "}
					{import.meta.env.VITE_CLIENT_LASTNAME}
				</span>
			</h1>
		</header>
	)
}

export default Header
