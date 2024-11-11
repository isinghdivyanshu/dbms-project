"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store";
import { toast } from "react-toastify";
import { handleLogin } from "@/methods/server";

export default function Login() {
	const router = useRouter();
	const { login } = useStore();

	const [userData, setUserData] = useState({
		username: "",
		password: "",
	});
	const [loading, setLoading] = useState("false");

	async function handleSubmit(e: any) {
		e.preventDefault();

		setLoading("true");
		const loginData = await handleLogin(
			userData.username,
			userData.password
		);

		if (!loginData?.error) {
			setLoading("false");
			toast.success("Login Successful");
			login(
				loginData?.response.user.email,
				loginData?.response.user.username,
				loginData?.response.token
			);
			localStorage.setItem("email", loginData?.response.user.email);
			localStorage.setItem("username", loginData?.response.user.username);
			localStorage.setItem("token", loginData?.response.token);
			router.push("/manager");
		}

		if (loginData?.error) {
			setLoading("false");
			toast.error(loginData.message?.message ?? "Error");
			console.log(loginData);
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
					<h1 className="text-3xl font-bold mb-5">Login</h1>
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
							Login
						</button>
					</div>
					<Link href="/register" className="text-sm">
						<span className="peer italic">New Here?</span>
						<span className="peer-hover:underline hover:underline mx-1 font-bold">
							Sign up
						</span>
					</Link>
				</form>
			</div>
		</>
	);
}
