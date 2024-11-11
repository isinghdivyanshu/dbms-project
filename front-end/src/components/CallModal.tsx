"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import useScreenWidth from "@/hooks/useScreenWidth";
import Modal from "react-modal";
import {
	createEvent,
	updateParticipant,
	addMember,
	removeParticipant,
} from "@/methods/server";
import { X } from "lucide-react";

export default function CallModal({
	refresh,
	setRefresh,
	setPageLoad,
	setTeamname,
	setMembers,
	setBlock,
	modal,
	data = null,
	areOpen,
	onClose,
}: {
	refresh?: boolean;
	setRefresh?: any;
	setPageLoad?: any;
	setTeamname?: any;
	setMembers?: any;
	setBlock?: any;
	modal: any;
	data?: any;
	areOpen: any;
	onClose: any;
}) {
	const windowWidth: any = useScreenWidth();
	const mobileWidth = 570;
	const check = windowWidth > mobileWidth;

	const customStyles = {
		content: {
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, -50%)",
			backgroundColor: "#111827",
			width: `${check ? "50%" : "90%"}`,
			maxHeight: "90%",
			border: "3px solid #374151",
			borderRadius: "10px",
			padding: "0",
		},
		overlay: {
			backgroundColor: "#1f293783",
		},
	};

	if (modal === "event")
		return (
			<EventModal
				isOpen={areOpen.eventModal === "true"}
				onClose={onClose}
				style={customStyles}
				data={data}
				refresh={refresh}
				setRefresh={setRefresh}
			/>
		);
	else if (modal === "participant" || modal === "member")
		return (
			<ParticipantModal
				isOpen={areOpen.participantModal === "true"}
				onClose={onClose}
				style={customStyles}
				data={data}
				refresh={refresh}
				setRefresh={setRefresh}
				setPageLoad={setPageLoad}
				setMembers={setMembers}
			/>
		);
	else if (modal === "addMember")
		return (
			<AddMemberModal
				isOpen={areOpen.addMemberModal === "true"}
				onClose={onClose}
				style={customStyles}
				data={data}
				refresh={refresh}
				setRefresh={setRefresh}
				setTeamname={setTeamname}
				setBlock={setBlock}
			/>
		);
}

function EventModal({
	isOpen,
	onClose,
	style,
	refresh,
	setRefresh,
}: {
	data: any;
	isOpen: any;
	onClose: () => {};
	style: any;
	refresh: boolean | undefined;
	setRefresh: any;
}) {
	const [eventDetail, setEventDetail] = useState({
		eventname: "",
	});
	const [loading, setLoading] = useState("false");

	async function handleSubmit(e: any) {
		e.preventDefault();

		setLoading("true");
		const event = await createEvent(
			localStorage?.getItem("token"),
			eventDetail.eventname
		);

		if (!event?.error) {
			setLoading("false");
			toast.success("Event Created");
			setRefresh(!refresh);
			onClose();
		}

		if (event?.error) {
			setLoading("true");
			toast.error(event.message?.message ?? "Error");
			console.log(event);
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			contentLabel="Event Modal"
			style={style}
			shouldCloseOnOverlayClick={false}
			ariaHideApp={false}
		>
			<h1 className="flex justify-between items-center text-2xl font-bold bg-[#1F2937] text-white px-10 py-3 align-bottom">
				<span className="flex gap-5 items-center justify-center">
					Create New Event
					{loading === "true" ? (
						<div className="border-b-8 rounded-full border-white bg-black animate-spin w-4 h-4"></div>
					) : null}
				</span>
				<X onClick={onClose} className="cursor-pointer" />
			</h1>
			<form
				className="p-10 text-white"
				autoComplete="off"
				onSubmit={handleSubmit}
			>
				<label htmlFor="eventname" className="flex flex-col gap-1 mb-3">
					Event Name
					<input
						type="text"
						name="eventname"
						id="eventname"
						placeholder="Add Event"
						value={eventDetail.eventname}
						onChange={(e) => {
							setEventDetail({ eventname: e.target.value });
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
						autoFocus
					/>
				</label>
				<button
					type="submit"
					className="float-right w-32 text-xl bg-[#1F2937] px-3 py-2 rounded-xl text-white my-5 font-medium border-2 border-[#374151] disabled:cursor-progress disabled:opacity-50 hover:scale-110"
					disabled={loading === "true"}
				>
					Save
				</button>
			</form>
		</Modal>
	);
}

function ParticipantModal({
	data,
	isOpen,
	onClose,
	style,
	refresh,
	setRefresh,
	setPageLoad,
	setMembers,
}: {
	data: any;
	isOpen: any;
	onClose: () => {};
	style: any;
	refresh: boolean | undefined;
	setRefresh: any;
	setPageLoad?: any;
	setMembers?: any;
}) {
	const [oldDetail, setOldDetail] = useState({
		name: data.name,
		regno: data.regno,
		phone: data.phone,
		teamname: data.teamname,
		accomodationType: data.accomodationType,
		block: data.block,
		inOutStatus: JSON.stringify(data.inOutStatus),
		inOutUpdateTime: data.inOutUpdateTime,
	});
	const [newDetail, setNewDetail] = useState({
		name: data.name,
		regno: data.regno,
		phone: data.phone,
		teamname: data.teamname,
		accomodationType: data.accomodationType,
		block: data.block,
		inOutStatus: JSON.stringify(data.inOutStatus),
	});
	const [loading, setLoading] = useState("false");

	let {
		name: oldName,
		regno: oldRegno,
		phone: oldPhone,
		teamname: oldTeamname,
		accomodationType: oldAccomodationType,
		block: oldBlock,
		inOutStatus: oldInOutStatus,
	} = oldDetail;
	let {
		name: newName,
		regno: newRegno,
		phone: newPhone,
		teamname: newTeamname,
		accomodationType: newAccomodationType,
		block: newBlock,
		inOutStatus: newInOutStatus,
	} = newDetail;

	console.log(oldDetail);
	console.log(newDetail);

	oldName = oldName.trim().toLowerCase();
	oldRegno = oldRegno.trim().toLowerCase();
	oldPhone = oldPhone.trim().toLowerCase();
	oldTeamname = oldTeamname.trim().toLowerCase();
	oldAccomodationType = oldAccomodationType.trim();
	oldBlock = oldBlock.trim().toLowerCase();
	oldInOutStatus = JSON.stringify(oldInOutStatus).trim().toLowerCase();

	newName = newName.trim().toLowerCase();
	newRegno = newRegno.trim().toLowerCase();
	newPhone = newPhone.trim().toLowerCase();
	newTeamname = newTeamname.trim().toLowerCase();
	newAccomodationType = newAccomodationType.trim();
	newBlock = newBlock.trim().toLowerCase();
	newInOutStatus = JSON.stringify(newInOutStatus).toLowerCase();

	async function handleSubmit(e: any) {
		e.preventDefault();

		setLoading("true");
		if (
			newName === oldName &&
			newRegno === oldRegno &&
			newPhone === oldPhone &&
			newTeamname === oldTeamname &&
			newAccomodationType === oldAccomodationType &&
			newBlock === oldBlock &&
			newInOutStatus === oldInOutStatus
		)
			onClose();
		else {
			const update = await updateParticipant(
				localStorage?.getItem("token"),
				{
					id: data.id,
					eventname: localStorage.getItem("eventname"),
					name: newDetail.name,
					regno: newDetail.regno,
					phone: newDetail.phone,
					teamname: newDetail.teamname,
					accomodationType: newDetail.accomodationType,
					block: newDetail.block,
					inOutStatus: newDetail.inOutStatus,
				}
			);

			if (!update?.error) {
				setRefresh(!refresh);
				setLoading("false");
				toast.success(update?.response.message);
				onClose();
			}

			if (update?.error) {
				setLoading("false");
				toast.error(update.message?.message ?? "Error");
				console.log(update);
			}
		}
	}

	async function handleUnregister() {
		setPageLoad("true");
		const remove = await removeParticipant(
			localStorage?.getItem("eventname"),
			newDetail.regno,
			localStorage?.getItem("token")
		);

		if (!remove?.error) {
			setRefresh(!refresh);
			setPageLoad("false");
			setMembers([]);
			toast.success(remove?.response.message);
			localStorage.setItem("teamname", "");
			onClose();
		}

		if (remove?.error) {
			setPageLoad("false");
			toast.error(remove?.message?.message ?? "Error");
			console.log(remove);
			localStorage.setItem("teamname", "");
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			contentLabel="Participant Modal"
			style={style}
			shouldCloseOnOverlayClick={false}
			ariaHideApp={false}
		>
			<h1 className="flex justify-between items-center text-2xl font-bold bg-[#1F2937] px-10 py-3 align-bottom text-white hover:text-gray-300 transition-colors duration-200">
				<span className="flex gap-5 items-center justify-center capitalize">
					{data.name}&apos;s Detail
					{loading === "true" ? (
						<div className="border-b-8 rounded-full border-white bg-black animate-spin w-4 h-4"></div>
					) : null}
				</span>
				<X onClick={onClose} className="cursor-pointer" />
			</h1>
			<form
				className="p-10 text-white"
				autoComplete="off"
				onSubmit={handleSubmit}
			>
				<label htmlFor="name" className="flex flex-col gap-1 mb-3">
					Name
					<input
						type="text"
						name="name"
						id="name"
						placeholder="Name"
						value={newDetail.name}
						onChange={(e) => {
							setNewDetail({
								...newDetail,
								name: e.target.value,
							});
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
						autoFocus
					/>
				</label>
				<label htmlFor="regno" className="flex flex-col gap-1 mb-3">
					Reg No
					<input
						type="text"
						name="regno"
						id="regno"
						placeholder="Reg No"
						value={newDetail.regno}
						onChange={(e) => {
							setNewDetail({
								...newDetail,
								regno: e.target.value.toUpperCase(),
							});
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
					/>
				</label>
				<label htmlFor="phone" className="flex flex-col gap-1 mb-3">
					Phone
					<input
						type="tel"
						name="phone"
						id="phone"
						placeholder="Phone"
						value={newDetail.phone}
						onChange={(e) => {
							setNewDetail({
								...newDetail,
								phone: e.target.value,
							});
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
					/>
				</label>
				<label htmlFor="teamname" className="flex flex-col gap-1 mb-3">
					Team Name
					<input
						type="text"
						name="teamname"
						id="teamname"
						placeholder="Team Name"
						value={newDetail.teamname}
						onChange={(e) => {
							setNewDetail({
								...newDetail,
								teamname: e.target.value,
							});
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
					/>
				</label>
				<div className="flex flex-col gap-1 mb-3">
					Accomodation
					<div className="flex justify-start items-center">
						<select
							name="accomodationType"
							id="accomodationType"
							value={newDetail.accomodationType}
							onChange={(e) => {
								setNewDetail({
									...newDetail,
									accomodationType: e.target.value,
								});
							}}
							className="text-white bg-transparent focus:outline-none"
							required
						>
							<option value="DAY_SCHOLAR" className="text-black">
								Day Scholar
							</option>
							<option value="BOYS_HOSTEL" className="text-black">
								Men&apos;s Hostel
							</option>
							<option value="GIRLS_HOSTEL" className="text-black">
								Ladies Hostel
							</option>
						</select>
					</div>
				</div>
				<label htmlFor="Block" className="flex flex-col gap-1 mb-3">
					Block
					<input
						type="text"
						name="block"
						id="block"
						placeholder="Block"
						value={newDetail.block}
						onChange={(e) => {
							setNewDetail({
								...newDetail,
								block: e.target.value,
							});
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
					/>
				</label>
				<div className="flex flex-col gap-1 mb-3">
					In Status
					<div className="flex justify-around items-center">
						<div>
							<label htmlFor="inside">Inside:</label>
							<input
								type="radio"
								name="inOutStatus"
								id="inside"
								value={newDetail.inOutStatus}
								onChange={(e) => {
									setNewDetail({
										...newDetail,
										inOutStatus: "true",
									});
								}}
								className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
								required
								checked={newDetail.inOutStatus === "true"}
							/>
						</div>
						<div>
							<label htmlFor="outside">Outside:</label>
							<input
								type="radio"
								name="inOutStatus"
								id="outside"
								value={newDetail.inOutStatus}
								onChange={(e) => {
									setNewDetail({
										...newDetail,
										inOutStatus: "false",
									});
								}}
								className="mx-3 focus:outline-none"
								required
								checked={newDetail.inOutStatus === "false"}
							/>
						</div>
					</div>
				</div>
				<button
					type="submit"
					className="float-right w-32 text-xl bg-gray-900 px-3 py-2 rounded-xl text-white my-5 font-medium border-2 border-[#374151] disabled:cursor-progress disabled:opacity-50 hover:scale-110"
					disabled={loading === "true"}
				>
					Save
				</button>
				<button
					className="float-left w-32 text-xl bg-gray-900 px-3 py-2 rounded-xl text-white my-5 font-medium border-2 border-[#374151] disabled:cursor-progress disabled:opacity-50 hover:scale-110"
					onClick={handleUnregister}
					disabled={loading === "true"}
				>
					Unregister
				</button>
			</form>
		</Modal>
	);
}

function AddMemberModal({
	data,
	isOpen,
	onClose,
	style,
	refresh,
	setRefresh,
	setTeamname,
}: {
	data: any;
	isOpen: any;
	onClose: () => {};
	style: any;
	refresh: boolean | undefined;
	setRefresh: any;
	setTeamname: any;
	setBlock: any;
}) {
	const [detail, setDetail] = useState({
		name: "",
		regno: "",
		phone: "",
		teamname: data.teamname,
		accomodationType: "BOYS_HOSTEL",
		block: "",
		inOutStatus: "true",
	});
	const [loading, setLoading] = useState("false");

	async function handleSubmit(e: any) {
		e.preventDefault();

		setLoading("true");
		const member = await addMember(localStorage?.getItem("token"), {
			id: data.id,
			eventname: localStorage.getItem("eventname"),
			teamname: localStorage.getItem("teamname"),
			name: detail.name,
			regno: detail.regno,
			phone: detail.phone,
			accomodationType: detail.accomodationType,
			block: detail.block,
			inOutStatus: detail.inOutStatus,
		});

		if (!member?.error) {
			setRefresh(!refresh);
			setLoading("false");
			toast.success(member?.response.message);
			onClose();
		}

		if (member?.error) {
			setLoading("false");
			toast.error(member.message?.message ?? "Error");
			console.log(member);
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			contentLabel="Add Member Modal"
			style={style}
			shouldCloseOnOverlayClick={false}
			ariaHideApp={false}
		>
			<h1 className="flex justify-between items-center text-2xl font-bold bg-[#1F2937] px-10 py-3 align-bottom text-white hover:text-gray-300 transition-colors duration-200">
				<span className="flex gap-5 items-center justify-center capitalize">
					Add Member
					{loading === "true" ? (
						<div className="border-b-8 rounded-full border-white bg-black animate-spin w-4 h-4"></div>
					) : null}
				</span>
				<X onClick={onClose} className="cursor-pointer" />
			</h1>
			<form
				className="p-10 text-white"
				autoComplete="off"
				onSubmit={handleSubmit}
			>
				<label htmlFor="name" className="flex flex-col gap-1 mb-3">
					Name
					<input
						type="text"
						name="name"
						id="name"
						placeholder="Name"
						value={detail.name}
						onChange={(e) => {
							setDetail({
								...detail,
								name: e.target.value,
							});
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
						autoFocus
					/>
				</label>
				<label htmlFor="regno" className="flex flex-col gap-1 mb-3">
					Reg No
					<input
						type="text"
						name="regno"
						id="regno"
						placeholder="Reg No"
						value={detail.regno}
						onChange={(e) => {
							setDetail({
								...detail,
								regno: e.target.value.toUpperCase(),
							});
						}}
						pattern="\d{2}[A-Z]{3}\d{4}"
						title="Registration number must be in the format: 12ABC1234"
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
					/>
				</label>
				<label htmlFor="phone" className="flex flex-col gap-1 mb-3">
					Phone
					<input
						type="tel"
						name="phone"
						id="phone"
						placeholder="Phone"
						value={detail.phone}
						onChange={(e) => {
							setDetail({
								...detail,
								phone: e.target.value,
							});
						}}
						pattern="\d{10}"
						title="Phone number must be exactly 10 digits"
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
					/>
				</label>
				<label htmlFor="teamname" className="flex flex-col gap-1 mb-3">
					Team Name
					<input
						type="text"
						name="teamname"
						id="teamname"
						placeholder="Team Name"
						value={detail.teamname}
						onChange={(e) => {
							setDetail({
								...detail,
								teamname: e.target.value,
							});
							localStorage.setItem("teamname", e.target.value);
							setTeamname(e.target.value);
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
					/>
				</label>
				<div className="flex flex-col gap-1 mb-3">
					Accomodation
					<div className="flex justify-start items-center">
						<select
							name="accomodationType"
							id="accomodationType"
							value={detail.accomodationType}
							onChange={(e) => {
								setDetail({
									...detail,
									accomodationType: e.target.value,
								});
							}}
							className="text-white bg-transparent focus:outline-none"
							required
						>
							<option value="DAY_SCHOLAR" className="text-black">
								Day Scholar
							</option>
							<option value="BOYS_HOSTEL" className="text-black">
								Men&apos;s Hostel
							</option>
							<option value="GIRLS_HOSTEL" className="text-black">
								Ladies Hostel
							</option>
						</select>
					</div>
				</div>
				<label htmlFor="Block" className="flex flex-col gap-1 mb-3">
					Block
					<input
						type="text"
						name="block"
						id="block"
						placeholder="Block"
						value={detail.block}
						onChange={(e) => {
							setDetail({
								...detail,
								block: e.target.value,
							});
						}}
						className="w-full border border-white rounded-md py-1 px-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-700"
						required
					/>
				</label>
				<div className="flex flex-col gap-1 mb-3">
					In Status
					<div className="flex justify-around items-center">
						<div>
							<label htmlFor="inside">Inside:</label>
							<input
								type="radio"
								name="inOutStatus"
								id="inside"
								value={detail.inOutStatus}
								onChange={(e) => {
									setDetail({
										...detail,
										inOutStatus: "true",
									});
								}}
								className="mx-3 focus:outline-none"
								required
								defaultChecked
							/>
						</div>
						<div>
							<label htmlFor="outside">Outside:</label>
							<input
								type="radio"
								name="inOutStatus"
								id="outside"
								value={detail.inOutStatus}
								onChange={(e) => {
									setDetail({
										...detail,
										inOutStatus: "false",
									});
								}}
								className="mx-3 focus:outline-none"
								required
							/>
						</div>
					</div>
				</div>
				<button
					type="submit"
					className="float-right w-32 text-xl bg-[#1F2937] px-3 py-2 rounded-xl text-white my-5 font-medium border-2 border-[#374151] disabled:cursor-progress disabled:opacity-50 hover:scale-110"
					disabled={loading === "true"}
				>
					Add
				</button>
			</form>
		</Modal>
	);
}
