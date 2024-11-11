const participantRouter = require("express").Router();
import { createEvent } from "../controller/EventController";
import {
	getEventParticipant,
	getTeam,
	registerEventParticipant,
	unregisterEventParticipant,
	updateEventParticipant,
} from "../controller/EventParticipantContoller";
import verifyToken from "../middleware/auth";

participantRouter.get("/", verifyToken, getEventParticipant);
participantRouter.post("/register", verifyToken, registerEventParticipant);
participantRouter.post("/update", verifyToken, updateEventParticipant);
participantRouter.delete("/", verifyToken, unregisterEventParticipant);
participantRouter.get("/team", verifyToken, getTeam);

//implement team fetching

export default participantRouter;
