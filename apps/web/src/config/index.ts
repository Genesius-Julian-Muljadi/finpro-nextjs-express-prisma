import { config } from "dotenv";

config({
    path: "../../.env",
});

export const {
    BASE_API_URL,
} = process.env;