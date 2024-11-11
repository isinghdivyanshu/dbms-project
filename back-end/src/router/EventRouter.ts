const eventRouter = require('express').Router();
import { createEvent, deleteEvent, getEventbyId, getSelfEvents, updateEvent } from "../controller/EventController";
import verifyToken from "../middleware/auth";



eventRouter.get("/self", verifyToken, getSelfEvents);
eventRouter.get("/:eventId", verifyToken, getEventbyId);
eventRouter.post("/create", verifyToken, createEvent);
eventRouter.post("/update/:eventId", verifyToken, updateEvent);
eventRouter.delete("/:eventId", verifyToken, deleteEvent);







export default eventRouter;