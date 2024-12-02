import express, { Request, Response, Application } from "express";
import { PORT } from "./config/index";
import cors from "cors";
import authrouter from "./routers/auth_routes";
import errorMiddleware from "./middlewares/error.middleware";
// import helmet from "helmet";
import datarouter from "./databasepopulation/router/router";

const port = Number(PORT) || 8000;
const app: Application = express();

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

// app.use(helmet);

app.use("/auth", authrouter);
app.use("/data", datarouter);

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Why are you using port ${port}?`);
});