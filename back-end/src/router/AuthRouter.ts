import { registerUser, loginUser } from "../controller/AuthController";
const authRouter = require('express').Router();


authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;





