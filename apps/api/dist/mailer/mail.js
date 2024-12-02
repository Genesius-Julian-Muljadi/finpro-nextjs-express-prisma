"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = require("../config/index");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: index_1.NODEMAILER_EMAIL,
        pass: index_1.NODEMAILER_PASSWORD,
    },
});
exports.transporter = transporter;
