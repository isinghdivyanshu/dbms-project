import e, { Request, Response } from "express";
import { Manager, PrismaClient } from "@prisma/client";
import { selectFields } from "express-validator/src/field-selection";

const prisma = new PrismaClient();

export interface ARequest extends Request {
	manager: Manager;
}

export async function registerEventParticipant(req: ARequest, res: Response) {
	try {
		let {
			regno,
			eventname,
			teamname,
			name,
			inOutStatus,
			accomodationType,
			block,
		} = req.body;
		if (!name) {
			return res.status(400).json({ message: "Name is required" });
		}
		let phone = req.body.phone;
		if (!phone) {
			phone = "";
		}
		if (!teamname) {
			return res.status(400).json({ message: "Team name is required" });
		}
		if (!regno) {
			return res.status(400).json({ message: "Regno is required" });
		}
		if (!eventname) {
			return res.status(400).json({ message: "Event name is required" });
		}
		if (!inOutStatus) {
			return res
				.status(400)
				.json({ message: "In/Out status is required" });
		}
		if (
			!["DAY_SCHOLAR", "GIRLS_HOSTEL", "BOYS_HOSTEL"].includes(
				accomodationType
			)
		) {
			return res
				.status(400)
				.json({ message: "Invalid accommodation type" });
		}
		if (accomodationType == "DAY_SCHOLAR") {
			block = null;
		}
		const inOutUpdateTime = new Date();
		inOutStatus = inOutStatus === "true";

		const event = await prisma.event.findUnique({
			where: {
				eventname: eventname,
			},
			include: {
				Managers: true,
				EventParticipants: true,
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const isManagerAssociated = event.Managers.some(
			(manager) => manager.id === req.manager.id
		);

		if (!isManagerAssociated) {
			return res
				.status(403)
				.json({ message: "You are not associated with this event" });
		}

		const participant = await prisma.eventParticipant.findUnique({
			where: {
				regno: regno,
			},
			include: {
				Events: true,
			},
		});

		if (participant) {
			const isParticipantRegistered = participant.Events.some(
				(event) => event.eventname === eventname
			);

			if (isParticipantRegistered) {
				return res
					.status(400)
					.json({
						message:
							"Participant already registered for this event",
					});
			} else {
				const updatedParticipant = await prisma.eventParticipant.update(
					{
						where: {
							regno: regno,
						},
						data: {
							Events: {
								connect: {
									eventname: eventname,
								},
							},
							accomodationType,
							block,
						},
					}
				);

				return res
					.status(200)
					.json({
						message: "Participant registered successfully",
						participant: updatedParticipant,
					});
			}
		}
		const existingTeam = await prisma.eventParticipant.findFirst({
			where: {
				teamname: {
					equals: teamname,
					mode: "insensitive",
				},
			},
			select: {
				teamname: true,
			},
		});

		const finalTeamName = existingTeam ? existingTeam.teamname : teamname;

		const newParticipant = await prisma.eventParticipant.create({
			data: {
				regno,
				phone,
				teamname: finalTeamName,
				inOutStatus,
				inOutUpdateTime,
				Events: {
					connect: {
						eventname: eventname,
					},
				},
				name,
				accomodationType,
				block,
			},
		});

		return res
			.status(201)
			.json({
				message: "Participant registered successfully",
				participant: newParticipant,
			});
	} catch (error) {
		console.error("Error registering user:", error);
		return res.status(500).json({ message: "Internal server error" });
	} finally {
		await prisma.$disconnect();
	}
}
export async function getEventParticipant(req: ARequest, res: Response) {
	try {
		const regno = req.query.regno as string;
		const eventName = req.query.eventname as string;

		if (!regno) {
			return res.status(400).json({ message: "Regno is required" });
		}

		if (!eventName) {
			return res.status(400).json({ message: "Event name is required" });
		}

		const event = await prisma.event.findUnique({
			where: {
				eventname: eventName,
			},
			include: {
				Managers: true,
				EventParticipants: true,
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const eventParticipants = event.EventParticipants;
		const isManagerAssociated = event.Managers.some(
			(manager) => manager.id === req.manager.id
		);

		if (!isManagerAssociated) {
			return res
				.status(403)
				.json({
					message:
						"You do not have permission to delete this participant",
				});
		}

		const participant = eventParticipants.find(
			(participant) => participant.regno === regno
		);

		if (participant) {
			return res.status(200).json(participant);
		}

		return res.status(404).json({ message: "Participant not found" });
	} catch (error) {
		console.error("Error getting user:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function unregisterEventParticipant(req: ARequest, res: Response) {
	try {
		const regno = req.query.regno as string;
		const eventName = req.query.eventname as string;

		if (!regno) {
			return res.status(400).json({ message: "Id is required" });
		}

		if (!eventName) {
			return res.status(400).json({ message: "Event name is required" });
		}

		const event = await prisma.event.findUnique({
			where: {
				eventname: eventName,
			},
			include: {
				Managers: true,
				EventParticipants: true,
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const isManagerAssociated = event.Managers.some(
			(manager) => manager.id === req.manager.id
		);

		if (!isManagerAssociated) {
			return res
				.status(403)
				.json({ message: "You are not associated with this event" });
		}

		const updatedEvent = await prisma.event.update({
			where: {
				eventname: eventName,
			},
			data: {
				EventParticipants: {
					disconnect: {
						regno: regno,
					},
				},
			},
		});

		return res
			.status(200)
			.json({
				message: "Participant unregistered from event successfully",
			});
	} catch (error) {
		console.error("Error deleting user:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function updateEventParticipant(req: ARequest, res: Response) {
	try {
		const regno = req.body.id;
		const eventName = req.body.eventname;

		if (!regno) {
			return res.status(400).json({ message: "Id is required" });
		}

		if (!eventName) {
			return res.status(400).json({ message: "Event name is required" });
		}

		const event = await prisma.event.findUnique({
			where: {
				eventname: eventName,
			},
			include: {
				Managers: true,
				EventParticipants: true,
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const isManagerAssociated = event.Managers.some(
			(manager) => manager.id === req.manager.id
		);

		if (!isManagerAssociated) {
			return res
				.status(403)
				.json({ message: "You are not associated with this event" });
		}

		const participant = event.EventParticipants.find(
			(participant) => participant.id === regno
		);

		if (!participant) {
			return res
				.status(404)
				.json({ message: "Participant not found in the event." });
		}
		let phone = req.body.phone;
		if (!phone) {
			phone = "";
		}
		const updatedParticipant = await prisma.eventParticipant.update({
			where: {
				id: regno,
			},
			data: {
				regno: req.body.regno,
				name: req.body.name,
				phone: phone,
				teamname: req.body.teamname,
				inOutStatus: req.body.inOutStatus === "true" ? true : false,
				inOutUpdateTime: new Date(),
				accomodationType: req.body.accomodationType,
				block: req.body.block,
			},
		});

		return res
			.status(200)
			.json({
				message: "Participant updated successfully",
				participant: updatedParticipant,
			});
	} catch (error) {
		console.error("Error updating user:", error);
		return res.status(500).json({ message: "Internal server error" });
	} finally {
		await prisma.$disconnect();
	}
}

export async function getAllEventParticipants(req: ARequest, res: Response) {
	try {
		const eventName = req.params.eventname;
		const event = await prisma.event.findUnique({
			where: {
				eventname: eventName,
			},
			include: {
				Managers: true,
				EventParticipants: true,
			},
		});
		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const isManagerAssociated = event.Managers.some(
			(manager) => manager.id === req.manager.id
		);

		if (!isManagerAssociated) {
			return res
				.status(403)
				.json({ message: "You are not associated with this event" });
		}

		const eventParticipants = event.EventParticipants;

		return res.status(200).json(eventParticipants);
	} catch (error) {
		console.error("Error getting all users:", error);
		return res.status(500).json({ message: "Internal server error" });
	} finally {
		await prisma.$disconnect();
	}
}

export async function getTeam(req: ARequest, res: Response) {
	try {
		const teamname = (req.query.teamname as string).toLowerCase();
		const eventName = req.query.eventname as string;

		if (!teamname) {
			return res.status(400).json({ message: "Team name is required" });
		}

		if (!eventName) {
			return res.status(400).json({ message: "Event name is required" });
		}

		const event = await prisma.event.findUnique({
			where: {
				eventname: eventName,
			},
			include: {
				Managers: true,
				EventParticipants: true,
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const isManagerAssociated = event.Managers.some(
			(manager) => manager.id === req.manager.id
		);

		if (!isManagerAssociated) {
			return res
				.status(403)
				.json({ message: "You are not associated with this event" });
		}

		const eventParticipants = event.EventParticipants;

		// Filter participants with initial character match
		const initialCharMatch = eventParticipants.filter((participant) =>
			participant.teamname.toLowerCase().startsWith(teamname)
		);

		// Filter participants containing the search term but not starting with it
		const substringMatch = eventParticipants.filter(
			(participant) =>
				participant.teamname.toLowerCase().includes(teamname) &&
				!participant.teamname.toLowerCase().startsWith(teamname)
		);

		// Combine results
		const teamParticipants = [...initialCharMatch, ...substringMatch];

		if (teamParticipants.length === 0) {
			return res.status(404).json({ message: "Team not found" });
		}

		return res.status(200).json({
			teamname,
			participants: teamParticipants,
		});
	} catch (error) {
		console.error("Error getting team:", error);
		return res.status(500).json({ message: "Internal server error" });
	} finally {
		await prisma.$disconnect();
	}
}
