import { config } from "dotenv";

config({
    path: ".env",
});

export const {
    PORT,
    DATABASE_URL,
    SECRET_KEY,
    SECRET_KEY2,
    NODEMAILER_EMAIL,
    NODEMAILER_PASSWORD,
    ADMIN_EMAIL,
} = process.env;