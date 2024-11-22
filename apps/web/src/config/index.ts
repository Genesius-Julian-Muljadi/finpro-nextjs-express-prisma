import { config } from "dotenv";

config({
    path: "../../.env",
});

export const {
    NEXT_PUBLIC_BASE_API_URL,
} = process.env;