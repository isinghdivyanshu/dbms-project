"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import CallModal from "@/components/CallModal";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { getManagerProfile } from "@/methods/server";

function Profile() {
	const [events, setEvents] = useState<any>([]);
	const [areModalsOpen, setAreModalsOpen] = useState({
		eventModal: "false",
	});
	const [modalType, setModalType] = useState<string>("");
	const [loading, setLoading] = useState("false");
	const [refresh, setRefresh] = useState(false);

	async function fetchProfile() {
		setLoading("true");
		const profile = await getManagerProfile(localStorage?.getItem("token"));

		if (!profile?.error) {
			setLoading("false");
			setEvents(profile?.response.events);
		}

		if (profile?.error) {
			setLoading("false");
			toast.error(profile.message?.message ?? "Error");
			console.log(profile);
		}
	}

	useEffect(() => {
		fetchProfile();
	}, [refresh]);

	const closeModals = () => {
		setAreModalsOpen({
			eventModal: "false",
		}),
			setModalType("");
	};

	return (
		<div className="min-h-screen p-10 bg-gray-900 text-white">
			<div className="flex justify-between items-center mb-10">
				<h1 className="flex gap-5 items-center text-4xl underline font-bold capitalize text-white hover:text-gray-300 transition-colors duration-200">
					{localStorage.getItem("username")}&apos;s Events
					{loading === "true" ? (
						<div className="border-b-8 rounded-full border-white bg-black animate-spin w-4 h-4"></div>
					) : null}
				</h1>
				<button
					className="group inline-flex gap-2 items-center border border-white rounded-md py-1 px-3 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 transition-colors duration-200"
					onClick={() => {
						setAreModalsOpen({
							...areModalsOpen,
							eventModal: "true",
						});
						setModalType("event");
					}}
				>
					<Plus className="text-white group-hover:text-blue-500 transition-colors duration-200" />
					Create
				</button>
			</div>
			{events.length > 0 ? (
				<div className="flex flex-col w-fit gap-4">
					<ShowEvents />
				</div>
			) : (
				<div>No events. Do some work.</div>
			)}
			<CallModal
				modal={modalType}
				areOpen={areModalsOpen}
				onClose={closeModals}
				refresh={refresh}
				setRefresh={setRefresh}
			/>
		</div>
	);

	function ShowEvents() {
		return events.map((event: any, index: number) => (
			<Link
				href={`/event/${event.id}`}
				key={index}
				id={event.id}
				className="border border-white rounded-md py-1 px-3 bg-gray-800 hover:bg-gray-700 text-justify hover:scale-105 hover:opacity-70 transition-all duration-200"
				onClick={() => {
					localStorage.setItem("eventname", event.eventname);
					localStorage.setItem("eventID", event.id);
				}}
			>
				{index + 1}. {event.eventname}
			</Link>
		));
	}
}

export default PrivateRoute(Profile);
