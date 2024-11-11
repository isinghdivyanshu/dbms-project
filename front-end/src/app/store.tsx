import { create } from "zustand";

type State = {
	email: string;
	username: string;
	token: string;
	isLoggedIn: boolean;
	login: (email: string, username: string, token: string) => void;
	logout: () => void;
	initializeFromLocalStorage: () => void;
};

export const useStore = create<State>((set) => ({
	email: "",
	username: "",
	token: "",

	isLoggedIn: false,
	login: (email: string, username: string, token: string) => {
		set({
			isLoggedIn: true,
			email: email,
			username: username,
			token: token,
		});
	},

	logout: () => {
		set({
			isLoggedIn: false,
			email: "",
			username: "",
			token: "",
		});
		localStorage.removeItem("email");
		localStorage.removeItem("username");
		localStorage.removeItem("token");
		localStorage.removeItem("eventID");
		localStorage.removeItem("eventname");
		localStorage.removeItem("teamname");
	},

	initializeFromLocalStorage: () => {
		const email = localStorage.getItem("email");
		const username = localStorage.getItem("username");
		const token = localStorage.getItem("token");
		if (email && username && token) {
			set({
				isLoggedIn: true,
				email: email,
				username: username,
				token: token,
			});
		}
	},
}));
