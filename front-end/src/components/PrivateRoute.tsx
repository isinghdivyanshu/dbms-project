"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/app/store";
import { toast } from "react-toastify";

export default function PrivateRoute(Component: any) {
	return function IsAuth(props: any) {
		const { isLoggedIn } = useStore();
		useEffect(() => {
			const email = localStorage.getItem("email");
			const username = localStorage.getItem("username");
			const auth = localStorage.getItem("token");
			if (!auth || !email || !username) {
				toast.error("Please login first.");
				redirect("/login");
			}
		}, [isLoggedIn]);

		if (!isLoggedIn) {
			return null;
		}

		return <Component {...props} />;
	};
}
