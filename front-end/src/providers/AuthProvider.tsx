"use client";

import { useEffect } from "react";
import { useStore } from "@/app/store";

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { initializeFromLocalStorage } = useStore();

	useEffect(() => {
		initializeFromLocalStorage();
	}, [initializeFromLocalStorage]);

	return <>{children}</>;
}
