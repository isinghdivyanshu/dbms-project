"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/app/store";
import Link from "next/link";
import { User } from "lucide-react";

export default function Navbar() {
	const { email, username, logout } = useStore();
	const router = useRouter();

	return (
		<div className="flex px-7 py-4 md:px-28 justify-between items-center bg-gray-800">
			<div className="flex gap-12 justify-between items-center">
				<Link href="/manager">
					<span className="text-xl font-extrabold hover:underline text-white">
						DBMS-PROJECT
					</span>
				</Link>
			</div>
			<div className="flex gap-6 justify-between items-center">
				<div className="dropdown relative">
					<User
						size={24}
						className="hover:cursor-pointer text-white"
					/>
					<div className="dropdown-content hidden absolute -right-[25%] rounded-md border border-white divide-y-2 divide-white bg-gray-700">
						<div className="w-full py-1 px-4">
							<span className="text-gray-400 py-2 italic">
								Email:{" "}
							</span>{" "}
							<span className="rounded py-2 text-white">
								{email}
							</span>
						</div>
						<div className="w-full py-3 px-4">
							<span className="text-gray-400 py-1 italic">
								UserName:{" "}
							</span>{" "}
							<span className="rounded py-2 text-white">
								{username}
							</span>
						</div>
						<div className="w-full flex flex-col gap-3 px-5 text-center py-3">
							<button
								onClick={() => {
									logout(), router.replace("/login");
								}}
								className="border border-white py-2 px-4 rounded hover:underline hover:bg-white hover:text-black"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
