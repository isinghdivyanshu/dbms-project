import  express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan'; 
const app = express();
const apiRouter = express.Router();
import authRouter from "../src/router/AuthRouter";
import managerRouter from '../src/router/ManagerRouter';
import eventRouter from '../src/router/EventRouter';
import participantRouter from '../src/router/EventParticipantRouter';
import activityLogRouter from '../src/router/ActivityLogRouter';

require("dotenv").config();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
      status : 'online'
    })
});


apiRouter.use("/auth", authRouter);
apiRouter.use("/manager", managerRouter);
apiRouter.use("/event", eventRouter);
apiRouter.use("/participant", participantRouter);
apiRouter.use("/activitylog", activityLogRouter );


app.use("/api", apiRouter);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    console.log('Server is running on port', PORT);
    console.log('Base URL is', baseUrl)
});

export default app;