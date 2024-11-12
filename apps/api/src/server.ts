import express, { Request, Response, Application } from "express";
import { PORT } from "./config/index";
import cors from "cors";
// import branchrouter from "./routes/branch_routes";
// import authrouter from "./routes/auth_routes";
import errorMiddleware from "./middlewares/error.middleware";

const port = Number(PORT) || 8000;
const app: Application = express();

app.use(cors());
app.use(express.json());

// app.use("/branchmanagement", branchrouter);
// app.use("/authmanagement", authrouter);

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Why are you using port ${port}?`);
});