"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import CallModal from "@/components/CallModal";
import { toast } from "react-toastify";
import { Undo2, UserPlus } from "lucide-react";
import { getTeam } from "@/methods/server";

function Participants() {
	const [teamname, setTeamname] = useState(
		typeof window !== "undefined" && localStorage
			? localStorage.getItem("teamname") ?? ""
			: ""
	);
	const [members, setMembers] = useState([]);
	const [areModalsOpen, setAreModalsOpen] = useState({
		participantModal: "false",
		addMemberModal: "true",
	});
	const [modalData, setModalData] = useState<object | string>("");
	const [modalType, setModalType] = useState<string>("");
	const [loading, setLoading] = useState("false");
	const [refresh, setRefresh] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState("");

	const controller = new AbortController();

	async function getTeamData() {
		setLoading("true");
		const team = await getTeam(
			localStorage?.getItem("eventname"),
			teamname,
			localStorage?.getItem("token")
		);

		if (!team?.error) {
			setLoading("false");
			setMembers(team?.response.participants);
		}

		if (team?.error) {
			setLoading("false");
			toast.error(team.message?.message ?? "Error");
			console.log(team);
			setMembers([]);
		}
	}

	useEffect(() => {
		if (
			localStorage.getItem("eventname") &&
			localStorage.getItem("teamname")
		) {
			getTeamData();
		}
	}, [refresh]);

	const closeModals = () => {
		setAreModalsOpen({
			participantModal: "false",
			addMemberModal: "false",
		}),
			setModalData("");
		setModalType("");
	};

	const highlightText = (text: string, query: string) => {
		if (!query) return text;
		const regex = new RegExp(`(${query})`, "gi");
		return text.replace(regex, "<span class='text-green-500'>$1</span>");
	};

	const filteredMembers = members.filter((member: any) => {
		return (
			member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.regno.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.teamname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.accomodationType
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			member.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
			JSON.stringify(member.inOutStatus)
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
	});

	return (
		<div className="min-h-screen relative p-10 bg-gray-900 text-white">
			<Link
				href={`/event/${localStorage?.getItem("eventID")}`}
				className="absolute top-5 left-5 text-white hover:text-gray-300 transition-colors duration-200"
				onClick={() => {
					controller.abort();
				}}
			>
				<Undo2 size={20} />
			</Link>
			<div className="w-11/12 mx-auto">
				<h1 className="flex gap-5 items-center text-4xl underline font-bold capitalize text-white hover:text-gray-300 transition-colors duration-200">
					{localStorage.getItem("eventname")}
					{loading === "true" ? (
						<div className="border-b-8 rounded-full border-white bg-black animate-spin w-4 h-4"></div>
					) : null}
				</h1>
				<form
					className="flex justify-center items-center gap-10"
					onSubmit={(e: any) => {
						e.preventDefault();
						getTeamData();
					}}
				>
					<label
						htmlFor="teamname"
						className="flex gap-3 justify-center items-center my-5"
					>
						<div className="text-xl font-semibold text-white hover:text-gray-300 transition-colors duration-200">
							Team
						</div>
						<input
							type="text"
							id="teamname"
							name="teamname"
							placeholder="Team Name"
							value={localStorage?.getItem("teamname") ?? ""}
							onChange={(e) => {
								setTeamname(e.target.value);
								localStorage.setItem(
									"teamname",
									e.target.value
								);
								setSearchQuery(e.target.value); // Update search query
							}}
							className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
							required
							autoFocus
						/>
					</label>
					<button
						type="submit"
						className="group inline-flex gap-2 items-center border border-white rounded-md py-1 px-3 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 transition-colors duration-200"
					>
						Search
					</button>
				</form>
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-xl font-semibold text-white hover:text-gray-300 transition-colors duration-200">
						Members: {filteredMembers.length}
					</h2>
					<button
						className="group inline-flex gap-2 items-center border border-white rounded-md py-1 px-3 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 transition-colors duration-200 mt-4"
						onClick={(event) => {
							event.stopPropagation();
							setAreModalsOpen({
								...areModalsOpen,
								addMemberModal: "true",
							});
							setModalData({
								teamname:
									localStorage.getItem("teamname") ??
									teamname,
							});
							setModalType("addMember");
						}}
					>
						<UserPlus
							size={20}
							className="text-white group-hover:text-blue-500 transition-colors duration-200"
						/>
						Add Member
					</button>
				</div>
				<div className="flex flex-col gap-3">
					<ShowMembers />
				</div>
			</div>
			<CallModal
				modal={modalType}
				data={modalData}
				areOpen={areModalsOpen}
				onClose={closeModals}
				refresh={refresh}
				setRefresh={setRefresh}
				setPageLoad={setLoading}
				setTeamname={setTeamname}
				setMembers={setMembers}
			/>
		</div>
	);

	function ShowMembers() {
		return filteredMembers.map((member: any, index: number) => {
			return (
				<div
					key={index}
					className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 hover:cursor-pointer hover:border-blue-500 hover:border-2 transition-colors duration-200"
					onClick={() => {
						setAreModalsOpen({
							...areModalsOpen,
							participantModal: "true",
						});
						setModalData({
							id: member.id,
							name: member.name,
							regno: member.regno,
							phone: member.phone,
							teamname: member.teamname,
							accomodationType: member.accomodationType,
							block: member.block,
							inOutStatus: member.inOutStatus,
						});
						setModalType("member");
					}}
				>
					<span className="italic">Name:</span>{" "}
					<span
						className="font-medium capitalize text-lg"
						dangerouslySetInnerHTML={{
							__html: highlightText(member.name, searchQuery),
						}}
					></span>
					<br />
					<span className="italic">Reg No.:</span>{" "}
					<span
						className="font-medium capitalize text-lg"
						dangerouslySetInnerHTML={{
							__html: highlightText(member.regno, searchQuery),
						}}
					></span>
					<br />
					<span className="italic">Phone:</span>{" "}
					<span
						className="font-medium capitalize text-lg"
						dangerouslySetInnerHTML={{
							__html: highlightText(member.phone, searchQuery),
						}}
					></span>
					<br />
					<span className="italic">Team Name:</span>{" "}
					<span
						className="font-medium capitalize text-lg"
						dangerouslySetInnerHTML={{
							__html: highlightText(member.teamname, searchQuery),
						}}
					></span>{" "}
					<br />
					<span className="italic">In Status:</span>{" "}
					<span
						className="font-medium capitalize text-lg"
						dangerouslySetInnerHTML={{
							__html: highlightText(
								JSON.stringify(member.inOutStatus),
								searchQuery
							),
						}}
					></span>
					<br />
					<span className="italic">Accomodation Type:</span>{" "}
					<span
						className="font-medium capitalize text-lg"
						dangerouslySetInnerHTML={{
							__html: highlightText(
								member.accomodationType,
								searchQuery
							),
						}}
					></span>{" "}
					<br />
					<span className="italic">Block:</span>{" "}
					<span
						className="font-medium capitalize text-lg"
						dangerouslySetInnerHTML={{
							__html: highlightText(member.block, searchQuery),
						}}
					></span>{" "}
					<br />
					<span className="italic">Last Spotted:</span>{" "}
					<span className="font-medium text-lg">
						{new Date(member.inOutUpdateTime).toDateString() +
							" " +
							"at" +
							" " +
							new Date(
								member.inOutUpdateTime
							).toLocaleTimeString()}
					</span>
					<br />
					<span className="font-medium text-lg">
						<button
							className="group inline-flex gap-2 items-center border border-white rounded-md py-1 px-3 bg-gray-800 hover:bg-gray-700 hover:border-blue-500 transition-colors duration-200 mt-4"
							onClick={(event) => {
								event.stopPropagation();
								setAreModalsOpen({
									...areModalsOpen,
									addMemberModal: "true",
								});
								setModalData({
									teamname: member.teamname,
								});
								setModalType("addMember");
							}}
						>
							<UserPlus
								size={20}
								className="text-white group-hover:text-blue-500 transition-colors duration-200"
							/>
							Add Member
						</button>
					</span>
					<br />
				</div>
			);
		});
	}
}

export default PrivateRoute(Participants);
