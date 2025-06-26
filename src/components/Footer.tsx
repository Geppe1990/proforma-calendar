import { IoMdHeart } from "react-icons/io"

const Footer = () => {
	return (
		<footer className="bg-gray-100 text-center text-sm text-gray-500 p-4 print:hidden">
			<div className={"flex justify-center items-center"}>
				&copy; {new Date().getFullYear()} Made with&nbsp;
				<IoMdHeart className={"text-red-600"} />
				&nbsp;by&nbsp;
				<a href="https://www.linkedin.com/in/giuseppevigneri/">Giuseppe Vigneri</a>
			</div>
		</footer>
	)
}

export default Footer
