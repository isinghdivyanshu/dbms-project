"use server";

// General Fetch Function
export async function fetchEndpoint({
	endPoint,
	method,
	header,
	reqBody,
	token,
}: {
	endPoint: string;
	method: string;
	header: boolean;
	reqBody?: any;
	token?: string | null;
}) {
	const baseURL = process.env.BASE_URL;

	const URL = `${baseURL}${endPoint}`;
	console.log(URL);

	let headers = header
		? {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
		  }
		: { "Content-Type": "application/json" };

	let body = reqBody ? JSON.stringify(reqBody) : undefined;

	try {
		const response = await fetch(URL, {
			method: method,
			headers: headers as HeadersInit,
			cache: "no-store",
			body: body,
		});

		if (response.ok) {
			const res = await response.json();
			console.log("[RESPONSE] -->", res);
			return {
				error: false,
				response: res,
			};
		}

		if (!response.ok) {
			const error = await response.json();
			console.log("[ERROR] -->", error);
			return {
				error: true,
				status: response.status,
				message: error,
			};
		}
	} catch (error: any) {
		console.log("Error =>", error);
		return {
			error: true,
			status: error.status,
			message: error.statusText,
		};
	}
}

// Login
export async function handleLogin(userName: string, password: string) {
	const login = await fetchEndpoint({
		endPoint: "/auth/login",
		method: "POST",
		header: false,
		reqBody: {
			username: userName,
			password: password,
		},
	});

	return login;
}

// SignUp
export async function handleSignUp(
	email: string,
	userName: string,
	password: string
) {
	const signUp = await fetchEndpoint({
		endPoint: "/auth/register",
		method: "POST",
		header: false,
		reqBody: {
			username: userName,
			password: password,
			email: email,
		},
	});

	return signUp;
}

// Manager's Events
export async function getManagerProfile(token: string | null) {
	const profile = await fetchEndpoint({
		endPoint: "/manager/me",
		method: "GET",
		header: true,
		token: token,
	});

	return profile;
}

// Create New Event
export async function createEvent(token: string | null, eventname: string) {
	const create = await fetchEndpoint({
		endPoint: "/event/create",
		method: "POST",
		header: true,
		token: token,
		reqBody: {
			eventname: eventname,
		},
	});

	return create;
}

// Get Event Details
export async function getEvent(id: number, token: string | null) {
	const event = await fetchEndpoint({
		endPoint: `/event/${id}`,
		method: "GET",
		header: true,
		token: token,
	});

	return event;
}

// Update Participant
export async function updateParticipant(token: string | null, reqBody: object) {
	const update = await fetchEndpoint({
		endPoint: "/participant/update",
		method: "POST",
		header: true,
		token: token,
		reqBody: reqBody,
	});

	return update;
}

// Get Team Details
export async function getTeam(
	eventname: string | null,
	teamname: string | null,
	token: string | null
) {
	const team = await fetchEndpoint({
		endPoint: `/participant/team?eventname=${eventname}&teamname=${teamname}`,
		method: "GET",
		header: true,
		token: token,
	});

	return team;
}

// Register Participant
export async function addMember(token: string | null, reqBody: object) {
	console.log(reqBody);
	const member = await fetchEndpoint({
		endPoint: "/participant/register",
		method: "POST",
		header: true,
		token: token,
		reqBody: reqBody,
	});

	return member;
}

// Unregister Participant
export async function removeParticipant(
	eventname: string | null,
	regno: string,
	token: string | null
) {
	const remove = await fetchEndpoint({
		endPoint: `/participant?regno=${regno}&eventname=${eventname}`,
		method: "DELETE",
		header: true,
		token: token,
	});

	return remove;
}
