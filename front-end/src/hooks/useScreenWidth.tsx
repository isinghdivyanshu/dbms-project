"use client";

import { useState, useEffect } from "react";

export default function useScreenWidth() {
	const [windowWidth, setWindowWidth] = useState(null);

	const isWindow = typeof window !== "undefined";

	const getWidth: any = () => (isWindow ? window.innerWidth : windowWidth);

	const resize = () => setWindowWidth(getWidth());

	useEffect(() => {
		if (isWindow) {
			setWindowWidth(getWidth());

			window.addEventListener("resize", resize);

			return () => window.removeEventListener("resize", resize);
		}
		//eslint-disable-next-line
	}, [isWindow]);

	return windowWidth;
}
