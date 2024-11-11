import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
	title: "FolksFlow - Events made easy",
	description: "Events made easy by GDSC",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
