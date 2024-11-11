const managerRouter = require('express').Router();
import { deleteManager, getAllManagersofEvent, getProfile, updateManager } from "../controller/ManagerController";
import verifyToken from "../middleware/auth";



managerRouter.get("/me", verifyToken, getProfile);
managerRouter.get("/", verifyToken, getAllManagersofEvent);
managerRouter.post("/update/:username", verifyToken, updateManager);
managerRouter.delete("/:username", verifyToken, deleteManager);
//implement forgot pass




export default managerRouter;