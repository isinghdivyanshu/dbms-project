"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import CallModal from "@/components/CallModal";
import { toast } from "react-toastify";
import { Undo2, UserPlus, Handshake, Users, Search } from "lucide-react";
import { getEvent, updateParticipant } from "@/methods/server";

function Events({ params }: { params: { id: any } }) {
	const [display, setDisplay] = useState("Participants");
	const [participants, setParticipants] = useState([]);
	const [teams, setTeams] = useState([]);
	const [areModalsOpen, setAreModalsOpen] = useState({
		participantModal: "false",
	});
	const [modalData, setModalData] = useState<object | null>(null);
	const [modalType, setModalType] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState("false");
	const [refresh, setRefresh] = useState(false);
	const [pageLoad, setPageLoad] = useState(true);

	const controller = new AbortController();

	// const highlightText = (text: string, query: string) => {
	// 	if (!query) return text;
	// 	const regex = new RegExp(`(${query})`, "gi");
	// 	return text.replace(regex, "<span class='text-green-500'>$1</span>");
	// };

	const filteredParticipants = participants.filter((participant: any) => {
		return (
			participant.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			participant.regno
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			participant.phone
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			participant.teamname
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			participant.accomodationType
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			participant.block
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			JSON.stringify(participant.inOutStatus)
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
	});

	const filteredTeams = teams.filter((team: any) => {
		return team.toLowerCase().includes(searchQuery.toLowerCase());
	});

	async function getEventData() {
		setLoading("true");
		try {
			const eventData = await getEvent(
				params.id,
				localStorage?.getItem("token")
			);

			if (!eventData?.error) {
				setLoading("false");
				setParticipants(eventData?.response.participants);
				setTeams(eventData?.response.teams);
			} else {
				setLoading("false");
				toast.error(eventData.message?.message ?? "Error");
				console.log(eventData);
			}
		} catch (error) {
			setLoading("false");
			toast.error("Failed to fetch event data");
			console.error("Error fetching event data:", error);
		}
	}

	useEffect(() => {
		getEventData();
	}, [refresh]);

	const closeModals = () => {
		setAreModalsOpen({
			participantModal: "false",
		}),
			setModalData(null);
		setModalType("");
	};

	return (
		<div className="min-h-screen relative p-10 bg-gray-900 text-white">
			<Link
				href="/manager"
				className="absolute top-5 left-5 text-white hover:text-gray-300 transition-colors duration-200"
				onClick={() => {
					controller.abort();
				}}
			>
				<Undo2 size={20} />
			</Link>
			<div className="w-11/12 mx-auto flex justify-between items-center">
				<h1 className="flex gap-5 items-center text-4xl underline font-bold capitalize text-white hover:text-gray-300 transition-colors duration-200">
					{localStorage.getItem("eventname")}
					{loading === "true" ? (
						<div className="border-b-8 rounded-full border-white bg-black animate-spin w-4 h-4"></div>
					) : null}
				</h1>
				<Link
					href="/event/participants"
					className="group inline-flex gap-2 items-center border border-white rounded-md py-1 px-3 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 transition-colors duration-200"
					onClick={() => {
						localStorage.setItem("teamname", "");
					}}
				>
					<UserPlus
						size={20}
						className="text-white group-hover:text-blue-500 transition-colors duration-200"
					/>
					Add Participants
				</Link>
			</div>
			<div className="w-11/12 flex flex-col flex-wrap gap-6 mx-auto my-10">
				<div className="flex gap-6">
					<button
						className={`group inline-flex gap-2 items-center border border-white rounded-md py-1 px-3 bg-gray-800 hover:border-blue-500 transition-colors duration-200
                        ${display === "Participants" ? "bg-gray-400" : ""}`}
						onClick={() => {
							setDisplay("Participants");
							setSearchQuery("");
						}}
					>
						<Users
							size={20}
							className="text-white group-hover:text-blue-500 transition-colors duration-200"
						/>
						Show Participants
					</button>
					<button
						className={`group inline-flex gap-2 items-center border border-white rounded-md py-1 px-3 bg-gray-800 hover:border-blue-500 transition-colors duration-200
                        ${display === "Teams" ? "bg-gray-400" : ""}`}
						onClick={() => {
							setDisplay("Teams");
							setSearchQuery("");
						}}
					>
						<Handshake
							size={20}
							className="text-white group-hover:text-blue-500 transition-colors duration-200"
						/>
						Show Teams
					</button>
				</div>
				<label htmlFor="search" className="flex items-center gap-2">
					<Search className="text-white" />
					<input
						type="text"
						id="search"
						name="search"
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						placeholder={`Search ${display}`}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</label>
				<div className="w-full bg-gray-800 mb-5 rounded-lg p-5">
					<h1 className="text-3xl font-semibold mb-7 text-white hover:text-gray-300 transition-colors duration-200">
						{display}
						{":"}{" "}
						{display === "Participants"
							? participants.length
							: teams.length}
					</h1>
					{display === "Participants" ? (
						<div className="flex flex-col gap-3">
							<ShowParticipants />
						</div>
					) : (
						<div className="flex flex-col gap-3">
							<ShowTeams />
						</div>
					)}
				</div>
			</div>
			<CallModal
				modal={modalType}
				data={modalData}
				areOpen={areModalsOpen}
				onClose={closeModals}
				refresh={refresh}
				setRefresh={setRefresh}
				setPageLoad={setPageLoad}
				setMembers={setMembers}
			/>
		</div>
	);

	function setMembers() {
		return;
	}

	function ShowParticipants() {
		return filteredParticipants.map((participant: any, index: number) => {
			const participantData = {
				id: participant.id,
				eventname: localStorage.getItem("eventname"),
				name: participant.name,
				regno: participant.regno,
				phone: participant.phone,
				accomodationType: participant.accomodationType,
				block: participant.block,
				teamname: participant.teamname,
			};
			let inOut = {
				inOutStatus: JSON.stringify(!participant.inOutStatus),
			};
			let reqBody = { ...participantData, ...inOut };

			return (
				<div
					key={index}
					className="flex items-center justify-between gap-20 w-full bg-gray-800 border border-gray-700 rounded-lg p-3 hover:cursor-pointer hover:border-blue-500 hover:border-2 transition-colors duration-200"
				>
					<div
						className="border border-slate-500 rounded-xl py-2 px-5 grow"
						onClick={() => {
							setAreModalsOpen({
								...areModalsOpen,
								participantModal: "true",
							});
							setModalData({
								id: participant.id,
								name: participant.name,
								regno: participant.regno,
								phone: participant.phone,
								teamname: participant.teamname,
								accomodationType: participant.accomodationType,
								block: participant.block,
								inOutStatus: participant.inOutStatus,
								inOutUpdateTime:
									new Date(
										participant.inOutUpdateTime
									).toDateString() +
									" " +
									"at" +
									" " +
									new Date(
										participant.inOutUpdateTime
									).toLocaleTimeString(),
							});
							setModalType("participant");
						}}
					>
						<span className="italic">Name:</span>{" "}
						<span
							className="font-medium capitalize text-lg text-blue-300"
							// dangerouslySetInnerHTML={{
							// 	__html: highlightText(
							// 		participant.name,
							// 		searchQuery
							// 	),
							// }}
						>
							{participant.name}
						</span>
						<br />
						<span className="italic">Reg No.:</span>{" "}
						<span
							className="font-medium capitalize text-lg text-blue-300"
							// dangerouslySetInnerHTML={{
							// 	__html: highlightText(
							// 		participant.regno,
							// 		searchQuery
							// 	),
							// }}
						>
							{participant.regno}
						</span>
						<br />
						<span className="italic">Phone:</span>{" "}
						<span
							className="font-medium capitalize text-lg text-blue-300"
							// dangerouslySetInnerHTML={{
							// 	__html: highlightText(
							// 		participant.phone,
							// 		searchQuery
							// 	),
							// }}
						>
							{participant.phone}
						</span>
						<br />
						<span className="italic">Team Name:</span>{" "}
						<span
							className="font-medium capitalize text-lg text-blue-300"
							// dangerouslySetInnerHTML={{
							// 	__html: highlightText(
							// 		participant.teamname,
							// 		searchQuery
							// 	),
							// }}
						>
							{participant.teamname}
						</span>{" "}
						<br />
						<span className="italic">Accomodation Type:</span>{" "}
						<span
							className="font-medium capitalize text-lg text-blue-300"
							// dangerouslySetInnerHTML={{
							// 	__html: highlightText(
							// 		participant.accomodationType,
							// 		searchQuery
							// 	),
							// }}
						>
							{participant.accomodationType}
						</span>{" "}
						<br />
						<span className="italic">Block:</span>{" "}
						<span
							className="font-medium capitalize text-lg text-blue-300"
							// dangerouslySetInnerHTML={{
							// 	__html: highlightText(
							// 		participant.block,
							// 		searchQuery
							// 	),
							// }}
						>
							{participant.block}
						</span>{" "}
						<br />
						<span className="italic">In Status:</span>{" "}
						<span
							className="font-medium capitalize text-lg text-blue-300"
							// dangerouslySetInnerHTML={{
							// 	__html: highlightText(
							// 		JSON.stringify(participant.inOutStatus),
							// 		searchQuery
							// 	),
							// }}
						>
							{participant.inOutStatus}
						</span>
						<br />
						<span className="italic">Last Spotted:</span>{" "}
						<span className="font-medium text-lg text-blue-300">
							{new Date(
								participant.inOutUpdateTime
							).toDateString() +
								" " +
								"at" +
								" " +
								new Date(
									participant.inOutUpdateTime
								).toLocaleTimeString()}
						</span>
						<br />
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={participant.inOutStatus}
							value={JSON.stringify(participant.inOutStatus)}
							className="sr-only peer"
							onChange={async () => {
								setLoading("true");
								const update = await updateParticipant(
									localStorage.getItem("token"),
									reqBody
								);

								if (!update?.error) {
									setLoading("false");
									toast.success("Participant Updated");
									setRefresh(!refresh);
								}

								if (update?.error) {
									setLoading("false");
									toast.error(
										update.message?.message ?? "Error"
									);
									console.log(update);
								}
							}}
							disabled={loading === "true"}
						/>
						<div
							className="group peer ring-0 bg-rose-400  rounded-full outline-none duration-300 after:duration-300 w-24 h-12  shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️']  after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-checked:after:content-['✔️'] peer-hover:after:scale-95
                        peer-disabled:opacity-50"
						></div>
					</label>
				</div>
			);
		});
	}

	function ShowTeams() {
		return filteredTeams.map((team: any, index: number) => {
			return (
				<Link
					href="/event/participants"
					key={index}
					className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 hover:cursor-pointer hover:border-blue-500 hover:border-2 transition-colors duration-200"
					onClick={() => {
						localStorage.setItem("teamname", team);
					}}
				>
					<span className="italic text-blue-300">Team Name:</span>{" "}
					<span
						className="font-medium capitalize text-lg text-blue-300"
						// dangerouslySetInnerHTML={{
						// 	__html: highlightText(team, searchQuery),
						// }}
					>
						{team}
					</span>
					<br />
				</Link>
			);
		});
	}
}

export default PrivateRoute(Events);
