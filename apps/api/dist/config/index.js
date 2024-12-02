"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_WEB_URL = exports.ADMIN_EMAIL = exports.NODEMAILER_PASSWORD = exports.NODEMAILER_EMAIL = exports.SECRET_KEY2 = exports.SECRET_KEY = exports.DIRECT_URL = exports.DATABASE_URL = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: ".env",
});
_a = process.env, exports.PORT = _a.PORT, exports.DATABASE_URL = _a.DATABASE_URL, exports.DIRECT_URL = _a.DIRECT_URL, exports.SECRET_KEY = _a.SECRET_KEY, exports.SECRET_KEY2 = _a.SECRET_KEY2, exports.NODEMAILER_EMAIL = _a.NODEMAILER_EMAIL, exports.NODEMAILER_PASSWORD = _a.NODEMAILER_PASSWORD, exports.ADMIN_EMAIL = _a.ADMIN_EMAIL, exports.BASE_WEB_URL = _a.BASE_WEB_URL;
