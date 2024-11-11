const activityLogRouter = require('express').Router();
import { createActivityLog, getParticipantAndEventActivityLog } from "../controller/ActivityLogController";
import verifyToken from "../middleware/auth";




activityLogRouter.post("/create", verifyToken, createActivityLog);
activityLogRouter.get("/logs", verifyToken, getParticipantAndEventActivityLog);




export default activityLogRouter;