"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllEvents = GetAllEvents;
exports.RegisterUser = RegisterUser;
exports.VerifyUser = VerifyUser;
exports.LoginUser = LoginUser;
exports.GetCouponDataByUserID = GetCouponDataByUserID;
exports.GetPointDataByUserID = GetPointDataByUserID;
exports.GetHistoryDataByUserID = GetHistoryDataByUserID;
exports.RegisterOrganizer = RegisterOrganizer;
exports.VerifyOrganizer = VerifyOrganizer;
exports.LoginOrganizer = LoginOrganizer;
exports.GetOrganizerNameByID = GetOrganizerNameByID;
exports.GetEventDataByEventID = GetEventDataByEventID;
exports.GetEventDataByOrganizerID = GetEventDataByOrganizerID;
exports.GetTransactionDataByTransactionID = GetTransactionDataByTransactionID;
exports.GetTransactionDataByEventID = GetTransactionDataByEventID;
exports.GetEventDiscountDataByEventID = GetEventDiscountDataByEventID;
exports.GetRatingsDataByEventID = GetRatingsDataByEventID;
exports.GetOrganizerDataByOrganizerID = GetOrganizerDataByOrganizerID;
exports.RegisterEventByOrganizerID = RegisterEventByOrganizerID;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const index_1 = require("../config/index");
const mail_1 = require("../mailer/mail");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const prisma = new client_1.PrismaClient();
function RegisterUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, firstName, lastName, password, referralCode } = req.body;
            if (referralCode) {
                const findRefCode = yield prisma.users.findUnique({
                    where: {
                        referralCode: referralCode,
                    },
                });
                if (!findRefCode) {
                    throw new Error("Referral code is not valid");
                }
                ;
            }
            ;
            const findUser = yield prisma.users.findUnique({
                where: {
                    email: email,
                }
            });
            if (findUser) {
                console.log("Duplicate email error");
                throw new Error("Email already exists");
            }
            ;
            const salt = yield (0, bcrypt_1.genSalt)(10);
            const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
            let refCode = "";
            function generateUniqueRefCode() {
                return __awaiter(this, void 0, void 0, function* () {
                    refCode = yield (0, bcrypt_1.hash)(email, salt); // Generate pseudo-random refCode using unique emails
                    refCode = refCode.replace(/[^\w\s]/gi, '');
                    refCode = refCode.slice(refCode.length - 15, refCode.length).toUpperCase();
                    let findRefCode = yield prisma.users.findUnique({
                        where: {
                            referralCode: refCode,
                        },
                    });
                    function incrementString(str) {
                        function incrementChar(c) {
                            let tc = c.charCodeAt(0) - 'A'.charCodeAt(0);
                            tc = (tc + 1) % 26;
                            return String.fromCharCode(tc + 'A'.charCodeAt(0));
                        }
                        ;
                        let charArray = str.split("");
                        let focus = charArray.length - 1;
                        while (focus >= 0 && charArray[focus] === 'Z') {
                            focus--;
                        }
                        ;
                        for (let i = charArray.length - 1; i > focus; i--) {
                            charArray[i] = '0';
                        }
                        ;
                        charArray[focus] = incrementChar(charArray[focus]);
                        return charArray.join();
                    }
                    ;
                    while (findRefCode) {
                        incrementString(refCode);
                        findRefCode = yield prisma.users.findUnique({
                            where: {
                                referralCode: refCode,
                            },
                        });
                    }
                    ;
                });
            }
            ;
            yield generateUniqueRefCode();
            let newUser;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                newUser = yield prisma.users.create({
                    data: {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: hashPassword,
                        referralCode: refCode,
                    }
                });
            }));
            const templatePath = path_1.default.join(__dirname, "../mailer/email_templates", "registerUser.hbs");
            const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
            const compiledTemplate = handlebars_1.default.compile(templateSource);
            let ln = lastName;
            if (!lastName) {
                ln = "";
            }
            ;
            const payload = {
                email: email,
                refCode: "",
            };
            if (referralCode) {
                payload.refCode = referralCode;
            }
            ;
            const token = (0, jsonwebtoken_1.sign)(payload, String(index_1.SECRET_KEY2), { expiresIn: "3hr" });
            let verifyURL = String(index_1.BASE_WEB_URL) + "/verifysignup/user" + "/" + token;
            const html = compiledTemplate({ email, firstName, ln, verifyURL });
            yield mail_1.transporter.sendMail({
                to: email,
                subject: "ConcertHub Registration Confirmation",
                html: html,
            });
            res.status(200).send({
                message: "Register successful!",
                data: newUser,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function VerifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, refCode } = req.user;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                const newUser = yield prisma.users.update({
                    where: {
                        email: email,
                    },
                    data: {
                        emailVerified: true,
                    },
                });
                if (refCode) {
                    const findRefCode = yield prisma.users.findUnique({
                        where: {
                            referralCode: refCode,
                        },
                    });
                    yield prisma.coupons.create({
                        data: {
                            code: refCode,
                            userID: newUser.id,
                        },
                    });
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 90);
                    yield prisma.point_Balance.create({
                        data: {
                            user1ID: findRefCode.id,
                            user2ID: newUser.id,
                            expiryDate: expiryDate,
                        },
                    });
                    yield prisma.users.update({
                        where: {
                            id: findRefCode.id,
                        },
                        data: {
                            pointBalance: findRefCode.pointBalance + 10000,
                        },
                    });
                }
                ;
            }));
            res.status(201).send({
                message: "Email verified",
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function LoginUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const findUser = yield prisma.users.findUnique({
                where: {
                    email: email,
                },
            });
            if (!findUser) {
                console.log("email not found in database");
                throw new Error("Invalid credentials");
            }
            ;
            if (findUser.active === "Locked") {
                console.log("Account locked: Too many failed logins");
                throw new Error("Account locked: Please contact an administrator");
            }
            ;
            if (findUser.emailVerified === false) {
                const emailpayload = {
                    email: email
                };
                const token = (0, jsonwebtoken_1.sign)(emailpayload, String(index_1.SECRET_KEY2), { expiresIn: "3hr" });
                const templatePath = path_1.default.join(__dirname, "../mailer/email_templates", "registerUser.hbs");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const firstName = findUser.firstName;
                const ln = findUser.lastName;
                const verifyURL = String(index_1.BASE_WEB_URL) + "/verifysignup/user" + "/" + token;
                const html = compiledTemplate({ email, firstName, ln, verifyURL });
                yield mail_1.transporter.sendMail({
                    to: email,
                    subject: "ConcertHub Organizer Registration Confirmation",
                    html: html,
                });
                throw new Error("Email not verified: A new verification email has been sent.");
            }
            ;
            const passwordMatches = yield (0, bcrypt_1.compare)(password, findUser.password);
            if (!passwordMatches) {
                yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    yield prisma.users.update({
                        where: {
                            id: findUser.id,
                        },
                        data: {
                            failedLogins: findUser.failedLogins + 1,
                        },
                    });
                }));
                if (findUser.failedLogins >= 5) {
                    yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                        yield prisma.users.update({
                            where: {
                                id: findUser.id,
                            },
                            data: {
                                active: "Locked",
                            },
                        });
                    }));
                }
                ;
                throw new Error("Invalid credentials");
            }
            ;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                yield prisma.users.update({
                    where: {
                        id: findUser.id,
                    },
                    data: {
                        failedLogins: 0,
                    },
                });
            }));
            const payload = {
                id: findUser.id,
                email: email,
                name: findUser.firstName,
                role: "user",
                refCode: findUser.referralCode,
                pointBalance: findUser.pointBalance,
            };
            const token = (0, jsonwebtoken_1.sign)(payload, String(index_1.SECRET_KEY));
            res.status(200)
                .cookie("access_token", token, { expires: new Date(new Date().valueOf() + 2400000) })
                .send({
                message: "Login successful!",
                cookie: token,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetCouponDataByUserID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const findUser = yield prisma.users.findUnique({
                where: {
                    id: parseInt(id),
                },
                include: {
                    coupons: true,
                },
            });
            if (!findUser) {
                throw new Error("User ID not found");
            }
            ;
            res.status(200).send({
                message: "Coupons retrieved",
                data: findUser.coupons,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetPointDataByUserID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const findUser = yield prisma.users.findUnique({
                where: {
                    id: parseInt(id),
                },
                include: {
                    codeUsed: true,
                },
            });
            if (!findUser) {
                throw new Error("User ID not found");
            }
            ;
            res.status(200).send({
                message: "Point history retrieved",
                data: findUser.codeUsed,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetHistoryDataByUserID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const findUser = yield prisma.users.findUnique({
                where: {
                    id: parseInt(id),
                },
                include: {
                    history: true,
                },
            });
            if (!findUser) {
                throw new Error("User ID not found");
            }
            ;
            res.status(200).send({
                message: "Point history retrieved",
                data: findUser.history,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetTransactionDataByTransactionID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const findUser = yield prisma.transactions.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            if (!findUser) {
                throw new Error("Transaction ID not found");
            }
            ;
            res.status(200).send({
                message: "Transaction details retrieved",
                data: findUser,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetEventDataByEventID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const findUser = yield prisma.events.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            if (!findUser) {
                throw new Error("Event ID not found");
            }
            ;
            res.status(200).send({
                message: "Event details retrieved",
                data: findUser,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetEventDataByOrganizerID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { page, pageSize } = req.query;
            const filter = {
                page: parseInt(String(page)) || 1,
                pageSize: parseInt(String(pageSize)) || 20
            };
            const findEvents = yield prisma.events.findMany({
                where: {
                    organizerID: parseInt(id),
                },
                skip: filter.page != 1 ? (filter.page - 1) * filter.pageSize : 0,
                take: filter.pageSize,
            });
            if (!findEvents) {
                throw new Error("Organizer ID not found");
            }
            ;
            res.status(200).send({
                message: "Event details retrieved",
                data: findEvents,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetTransactionDataByEventID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const findTransactions = yield prisma.transactions.findMany({
                where: {
                    eventID: parseInt(id),
                },
            });
            if (!findTransactions) {
                throw new Error("Event ID not found");
            }
            ;
            res.status(200).send({
                message: "Transaction details retrieved",
                data: findTransactions,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function RegisterOrganizer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, name, password } = req.body;
            const findUser = yield prisma.organizers.findUnique({
                where: {
                    email: email,
                }
            });
            if (findUser) {
                console.log("Duplicate email error");
                throw new Error("Email already exists");
            }
            ;
            const salt = yield (0, bcrypt_1.genSalt)(10);
            const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
            let newOrganizer;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                newOrganizer = yield prisma.organizers.create({
                    data: {
                        email: email,
                        name: name,
                        password: hashPassword,
                    }
                });
            }));
            const payload = {
                email: email
            };
            const token = (0, jsonwebtoken_1.sign)(payload, String(index_1.SECRET_KEY2), { expiresIn: "3hr" });
            const templatePath = path_1.default.join(__dirname, "../mailer/email_templates", "registerOrganizer.hbs");
            const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
            const compiledTemplate = handlebars_1.default.compile(templateSource);
            const verifyURL = String(index_1.BASE_WEB_URL) + "/verifysignup/organizer" + "/" + token;
            const html = compiledTemplate({ email, name, verifyURL });
            yield mail_1.transporter.sendMail({
                to: email,
                subject: "ConcertHub Organizer Registration Confirmation",
                html: html,
            });
            res.status(200).send({
                message: "Register successful!",
                data: newOrganizer,
                access_token: token,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function VerifyOrganizer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.organizer;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                yield prisma.organizers.update({
                    where: {
                        email: email,
                    },
                    data: {
                        emailVerified: true,
                    },
                });
            }));
            res.status(201).send({
                message: "Email verified",
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function LoginOrganizer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const findUser = yield prisma.organizers.findUnique({
                where: {
                    email: email,
                }
            });
            if (!findUser) {
                throw new Error("Invalid credentials");
            }
            ;
            if (findUser.failedLogins >= 5) {
                console.log("Account locked: Too many failed logins");
                throw new Error("Account locked: Please contact an administrator");
            }
            ;
            const passwordMatches = yield (0, bcrypt_1.compare)(password, findUser.password);
            if (!passwordMatches) {
                throw new Error("Invalid credentials");
            }
            ;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                yield prisma.organizers.update({
                    where: {
                        id: findUser.id,
                    },
                    data: {
                        failedLogins: 0,
                    },
                });
            }));
            if (findUser.emailVerified === false) {
                const emailpayload = {
                    email: email
                };
                const token = (0, jsonwebtoken_1.sign)(emailpayload, String(index_1.SECRET_KEY2), { expiresIn: "3hr" });
                const templatePath = path_1.default.join(__dirname, "../mailer/email_templates", "registerOrganizer.hbs");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const name = findUser.name;
                const verifyURL = String(index_1.BASE_WEB_URL) + "/verifysignup/organizer" + "/" + token;
                const html = compiledTemplate({ email, name, verifyURL });
                yield mail_1.transporter.sendMail({
                    to: email,
                    subject: "ConcertHub Organizer Registration Confirmation",
                    html: html,
                });
                throw new Error("Email not verified: A new verification email has been sent.");
            }
            ;
            const payload = {
                id: findUser.id,
                email: email,
                name: findUser.name,
                role: "organizer",
            };
            const token = (0, jsonwebtoken_1.sign)(payload, String(index_1.SECRET_KEY));
            res.status(200)
                .cookie("access_token", token, { expires: new Date(new Date().valueOf() + 2400000) })
                .send({
                message: "Login successful!",
                cookie: token,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetOrganizerNameByID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const findOrganizer = yield prisma.organizers.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            if (!findOrganizer) {
                throw new Error("Organizer not found with ID!");
            }
            ;
            res.status(200).send({
                message: "Organizer found",
                data: findOrganizer.name,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetEventDiscountDataByEventID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error("ID error!");
            }
            ;
            const findEvent = yield prisma.events.findUnique({
                where: {
                    id: parseInt(id),
                },
                include: {
                    discountLimited: true,
                    discountDeadline: true,
                },
            });
            if (!findEvent) {
                throw new Error("ID not found!");
            }
            ;
            res.status(200).send({
                message: "Discount data retrieved",
                data: { limited: findEvent.discountLimited, deadline: findEvent.discountDeadline },
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetRatingsDataByEventID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error("ID error!");
            }
            ;
            const findRatings = yield prisma.event_Ratings.findMany({
                where: {
                    eventID: parseInt(id),
                },
            });
            if (!findRatings) {
                throw new Error("EventID not found!");
            }
            ;
            res.status(200).send({
                message: "Ratings retrieved",
                data: findRatings,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetOrganizerDataByOrganizerID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error("ID error!");
            }
            ;
            const findOrganizer = yield prisma.organizers.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            if (!findOrganizer) {
                throw new Error("OrganizerID not found!");
            }
            ;
            res.status(200).send({
                message: "Organizer retrieved",
                data: findOrganizer,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function RegisterEventByOrganizerID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { image, title, eventDate, overview, genre, venue, eventDesc, maxNormals, maxVIPs, normalPrice, VIPPrice, discountType } = req.body;
            let newEvent;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                newEvent = yield prisma.events.create({
                    data: {
                        image: image,
                        title: title,
                        eventDate: new Date(eventDate),
                        overview: overview,
                        genre: genre,
                        venue: venue,
                        eventDesc: eventDesc,
                        maxNormals: maxNormals,
                        maxVIPs: maxVIPs,
                        normalPrice: normalPrice,
                        VIPPrice: VIPPrice,
                        discountType: discountType,
                        organizerID: parseInt(id),
                    },
                });
            }));
            res.status(200).send({
                message: "Event creation successful!",
                data: newEvent,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetAllEvents(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prisma.events.findMany({});
            res.status(200).send({
                message: "Events fetched",
                data: data,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
