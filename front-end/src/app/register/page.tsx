"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store";
import { toast } from "react-toastify";
import { handleSignUp } from "@/methods/server";

export default function SignUp() {
	const router = useRouter();
	const { login } = useStore();

	const [userData, setUserData] = useState({
		email: "",
		username: "",
		password: "",
	});
	const [loading, setLoading] = useState("false");

	async function handleSubmit(e: any) {
		e.preventDefault();

		setLoading("true");
		const signUpData = await handleSignUp(
			userData.email,
			userData.username,
			userData.password
		);

		if (!signUpData?.error) {
			setLoading("false");
			toast.success("SignUp Successful");
			login(
				signUpData?.response.manager.email,
				signUpData?.response.manager.username,
				signUpData?.response.token
			);
			localStorage.setItem("email", signUpData?.response.manager.email);
			localStorage.setItem(
				"username",
				signUpData?.response.manager.username
			);
			localStorage.setItem("token", signUpData?.response.token);
			router.push("/manager");
		}

		if (signUpData?.error) {
			setLoading("false");
			toast.error(signUpData.message?.message ?? "Error");
			console.log(signUpData);
		}
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
				<p className="text-xl font-bold m-5 text-center">
					DBMS PROJECT
					<br />
					Events Portal
				</p>
				<form
					className="flex flex-col items-center justify-center bg-gray-800 p-5 rounded-lg"
					onSubmit={(e) => {
						handleSubmit(e);
					}}
				>
					<h1 className="text-3xl font-bold mb-5">Sign Up</h1>
					<div className="flex flex-col my-3">
						<label htmlFor="email" className="mr-5">
							Email:
						</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							value={userData.email}
							onChange={(e) => {
								setUserData({
									...userData,
									email: e.target.value,
								});
							}}
							required
							className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						/>
					</div>
					<div className="flex flex-col my-3">
						<label htmlFor="username" className="mr-5">
							Username:
						</label>
						<input
							type="text"
							id="username"
							name="username"
							placeholder="UserName"
							value={userData.username}
							onChange={(e) => {
								setUserData({
									...userData,
									username: e.target.value,
								});
							}}
							required
							autoFocus
							autoComplete="off"
							className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						/>
					</div>
					<div className="flex flex-col my-3">
						<label htmlFor="password" className="mr-5">
							Password:
						</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="********"
							value={userData.password}
							onChange={(e) => {
								setUserData({
									...userData,
									password: e.target.value,
								});
							}}
							required
							className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						/>
					</div>
					<div className="flex flex-col my-3">
						<button
							type="submit"
							className="bg-slate-400 rounded-md px-3 py-1 hover:scale-105 disabled:cursor-progress disabled:opacity-50"
							disabled={loading === "true"}
						>
							Register
						</button>
					</div>
					<Link href="/login" className="text-sm">
						<span className="peer italic ">
							Already Registered?
						</span>
						<span className="peer-hover:underline hover:underline  mx-1 font-bold">
							Login
						</span>
					</Link>
				</form>
			</div>
		</>
	);
}
