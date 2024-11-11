"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";

function Home() {
	const router = useRouter();

	useEffect(() => {
		router.replace("/manager");
	}, []); // Empty dependency array ensures this runs once after initial render

	return null;
}

export default PrivateRoute(Home);
