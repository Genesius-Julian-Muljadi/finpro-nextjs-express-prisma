"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./config/index");
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routers/auth_routes"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
// import helmet from "helmet";
const router_1 = __importDefault(require("./databasepopulation/router/router"));
const port = Number(index_1.PORT) || 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
// app.use(helmet);
app.use("/auth", auth_routes_1.default);
app.use("/data", router_1.default);
app.use(error_middleware_1.default);
app.listen(port, () => {
    console.log(`Why are you using port ${port}?`);
});
