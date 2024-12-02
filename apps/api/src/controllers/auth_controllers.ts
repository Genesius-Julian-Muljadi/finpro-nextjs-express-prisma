import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { BASE_WEB_URL, SECRET_KEY, SECRET_KEY2 } from "../config/index";
import { Organizer, User } from "../custom.d";
import { transporter } from "../mailer/mail";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";

const prisma = new PrismaClient();

async function RegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, firstName, lastName, password, referralCode } = req.body;
        if (referralCode) {
            const findRefCode = await prisma.users.findUnique({
                where: {
                    referralCode: referralCode,
                },
            });
            if (!findRefCode) {
                throw new Error("Referral code is not valid");
            };
        };

        const findUser = await prisma.users.findUnique({
            where: {
                email: email,
            }
        });
        if (findUser) {
            console.log("Duplicate email error");
            throw new Error("Email already exists");
        };

        const salt = await genSalt(10);
        const hashPassword = await hash(password, salt);

        let refCode: string = "";

        async function generateUniqueRefCode() {
            refCode = await hash(email, salt);  // Generate pseudo-random refCode using unique emails
            refCode = refCode.replace(/[^\w\s]/gi, '');
            refCode = refCode.slice(refCode.length - 15, refCode.length).toUpperCase();

            let findRefCode = await prisma.users.findUnique({
                where: {
                    referralCode: refCode,
                },
            });

            function incrementString(str: string): string {
                function incrementChar(c: string): string {
                    let tc: number = c.charCodeAt(0) - 'A'.charCodeAt(0);
                    tc = (tc + 1) % 26;
                    return String.fromCharCode(tc + 'A'.charCodeAt(0));
                };

                let charArray: Array<string> = str.split("");
                let focus: number = charArray.length - 1;
                while (focus >= 0 && charArray[focus] === 'Z') {
                    focus--;
                };
                
                for (let i = charArray.length - 1; i > focus; i--) {
                    charArray[i] = '0';
                };
                charArray[focus] = incrementChar(charArray[focus]);

                return charArray.join();
            };

            while (findRefCode) {
                incrementString(refCode);
                findRefCode = await prisma.users.findUnique({
                    where: {
                        referralCode: refCode,
                    },
                });
            };
        };
        await generateUniqueRefCode();

        let newUser;

        await prisma.$transaction(async (prisma) => {
            newUser = await prisma.users.create({
                data: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: hashPassword,
                    referralCode: refCode,
                }
            });
        });
        
        const templatePath = path.join(
            __dirname,
            "../mailer/email_templates",
            "registerUser.hbs"
        );
        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = Handlebars.compile(templateSource);
        let ln = lastName;
        if (!lastName) {
            ln = "";
        };
        const payload = {
            email: email,
            refCode: "",
        };
        if (referralCode) {
            payload.refCode = referralCode;
        };
        const token = sign(payload, String(SECRET_KEY2), { expiresIn: "3hr" });
        let verifyURL: String = String(BASE_WEB_URL) + "/verifysignup/user" + "/" + token;
        const html = compiledTemplate({ email, firstName, ln, verifyURL });

        await transporter.sendMail({
            to: email,
            subject: "ConcertHub Registration Confirmation",
            html: html,
        });

        res.status(200).send({
            message: "Register successful!",
            data: newUser,
        });

    } catch(err) {
        next(err);
    };
};

async function VerifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, refCode } = req.user as User;
        await prisma.$transaction(async (prisma) => {
            const newUser = await prisma.users.update({
                where: {
                    email: email,
                },
                data: {
                    emailVerified: true,
                },
            });

            if (refCode) {
                const findRefCode = await prisma.users.findUnique({
                    where: {
                        referralCode: refCode,
                    },
                });

                await prisma.coupons.create({
                    data: {
                        code: refCode,
                        userID: newUser.id,
                    },
                });

                const expiryDate: Date = new Date();
                expiryDate.setDate(expiryDate.getDate() + 90);
                await prisma.point_Balance.create({
                    data: {
                        user1ID: findRefCode!.id,
                        user2ID: newUser.id,
                        expiryDate: expiryDate,
                    },
                });

                await prisma.users.update({
                    where: {
                        id: findRefCode!.id,
                    },
                    data: {
                        pointBalance: findRefCode!.pointBalance + 10000,
                    },
                });
            };
        });

        res.status(201).send({
            message: "Email verified",
        });
    } catch (err) {
        next(err);
    };
};

async function LoginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const findUser = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!findUser) {
            console.log("email not found in database");
            throw new Error("Invalid credentials");
        };

        if (findUser.active === "Locked") {
            console.log("Account locked: Too many failed logins")
            throw new Error("Account locked: Please contact an administrator");
        };

        if (findUser.emailVerified === false) {
            const emailpayload = {
                email: email
            };
            const token = sign(emailpayload, String(SECRET_KEY2), { expiresIn: "3hr" });
            
            const templatePath = path.join(
                __dirname,
                "../mailer/email_templates",
                "registerUser.hbs"
            );
    
            const templateSource = fs.readFileSync(templatePath, "utf-8");
            const compiledTemplate = Handlebars.compile(templateSource);
            const firstName = findUser.firstName;
            const ln = findUser.lastName;
            const verifyURL: String = String(BASE_WEB_URL) + "/verifysignup/user" + "/" + token;
            const html = compiledTemplate({ email, firstName, ln, verifyURL });
    
            await transporter.sendMail({
                to: email,
                subject: "ConcertHub Organizer Registration Confirmation",
                html: html,
            });

            throw new Error("Email not verified: A new verification email has been sent.");
        };

        const passwordMatches = await compare(password, findUser.password);
        if (!passwordMatches) {
            await prisma.$transaction(async (prisma) => {
                await prisma.users.update({
                    where: {
                        id: findUser!.id,
                    },
                    data: {
                        failedLogins: findUser.failedLogins + 1,
                    },
                });
            });

            if (findUser.failedLogins >= 5) {
                await prisma.$transaction(async (prisma) => {
                    await prisma.users.update({
                        where: {
                            id: findUser!.id,
                        },
                        data: {
                            active: "Locked",
                        },
                    });
                });
            };
            throw new Error("Invalid credentials");
        };

        await prisma.$transaction(async (prisma) => {
            await prisma.users.update({
                where: {
                    id: findUser!.id,
                },
                data: {
                    failedLogins: 0,
                },
            });
        });

        const payload = {
            id: findUser.id,
            email: email,
            name: findUser.firstName,
            role: "user",
            refCode: findUser.referralCode,
            pointBalance: findUser.pointBalance,
        };
        const token = sign(payload, String(SECRET_KEY))

        res.status(200)
        .cookie("access_token", token, { expires: new Date(new Date().valueOf() + 2400000) })
        .send({
            message: "Login successful!",
        });

    } catch(err) {
        next(err);
    };
};

async function GetCouponDataByUserID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const findUser = await prisma.users.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                coupons: true,
            },
        });

        if (!findUser) {
            throw new Error("User ID not found");
        };

        res.status(200).send({
            message: "Coupons retrieved",
            data: findUser.coupons,
        });
    } catch (err) {
        next(err);
    };
};

async function GetPointDataByUserID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const findUser = await prisma.users.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                codeUsed: true,
            },
        });

        if (!findUser) {
            throw new Error("User ID not found");
        };

        res.status(200).send({
            message: "Point history retrieved",
            data: findUser.codeUsed,
        });
    } catch (err) {
        next(err);
    };
};

async function GetHistoryDataByUserID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const findUser = await prisma.users.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                history: true,
            },
        });

        if (!findUser) {
            throw new Error("User ID not found");
        };

        res.status(200).send({
            message: "Point history retrieved",
            data: findUser.history,
        });
    } catch (err) {
        next(err);
    };
};

async function GetTransactionDataByTransactionID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const findUser = await prisma.transactions.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!findUser) {
            throw new Error("Transaction ID not found");
        };

        res.status(200).send({
            message: "Transaction details retrieved",
            data: findUser,
        });
    } catch (err) {
        next(err);
    };
};

async function GetEventDataByEventID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const findUser = await prisma.events.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!findUser) {
            throw new Error("Event ID not found");
        };

        res.status(200).send({
            message: "Event details retrieved",
            data: findUser,
        });
    } catch (err) {
        next(err);
    };
};

async function GetEventDataByOrganizerID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { page, pageSize } = req.query;
        const filter: {page: number; pageSize: number} = {
            page: parseInt(String(page)) || 1,
            pageSize: parseInt(String(pageSize)) || 20
        };

        const findEvents = await prisma.events.findMany({
            where: {
                organizerID: parseInt(id),
            },
            skip: filter.page != 1 ? (filter.page - 1) * filter.pageSize : 0,
            take: filter.pageSize,
        });

        if (!findEvents) {
            throw new Error("Organizer ID not found");
        };

        res.status(200).send({
            message: "Event details retrieved",
            data: findEvents,
        });
    } catch (err) {
        next(err);
    };
};

async function GetTransactionDataByEventID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const findTransactions = await prisma.transactions.findMany({
            where: {
                eventID: parseInt(id),
            },
        });

        if (!findTransactions) {
            throw new Error("Event ID not found");
        };

        res.status(200).send({
            message: "Transaction details retrieved",
            data: findTransactions,
        });
    } catch (err) {
        next(err);
    };
};

async function RegisterOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, name, password } = req.body;

        const findUser = await prisma.organizers.findUnique({
            where: {
                email: email,
            }
        });
        if (findUser) {
            console.log("Duplicate email error");
            throw new Error("Email already exists");
        };

        const salt = await genSalt(10);
        const hashPassword = await hash(password, salt);
        
        let newOrganizer;

        await prisma.$transaction(async (prisma) => {
            newOrganizer = await prisma.organizers.create({
                data: {
                    email: email,
                    name: name,
                    password: hashPassword,
                }
            });
        });

        const payload = {
            email: email
        };
        const token = sign(payload, String(SECRET_KEY2), { expiresIn: "3hr" });
        
        const templatePath = path.join(
            __dirname,
            "../mailer/email_templates",
            "registerOrganizer.hbs"
        );

        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = Handlebars.compile(templateSource);
        const verifyURL: String = String(BASE_WEB_URL) + "/verifysignup/organizer" + "/" + token;
        const html = compiledTemplate({ email, name, verifyURL });

        await transporter.sendMail({
            to: email,
            subject: "ConcertHub Organizer Registration Confirmation",
            html: html,
        });
    
        res.status(200).send({
            message: "Register successful!",
            data: newOrganizer,
            access_token: token,
        });

    } catch(err) {
        next(err);
    };
};

async function VerifyOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.organizer as Organizer;
        await prisma.$transaction(async (prisma) => {
            await prisma.organizers.update({
                where: {
                    email: email,
                },
                data: {
                    emailVerified: true,
                },
            });
        });

        res.status(201).send({
            message: "Email verified",
        });
    } catch (err) {
        next(err);
    };
};

async function LoginOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const findUser = await prisma.organizers.findUnique({
            where: {
                email: email,
            }
        });
        if (!findUser) {
            throw new Error("Invalid credentials");
        };

        if (findUser.failedLogins >= 5) {
            console.log("Account locked: Too many failed logins")
            throw new Error("Account locked: Please contact an administrator");
        };

        const passwordMatches = await compare(password, findUser.password);
        if (!passwordMatches) {
            throw new Error("Invalid credentials");
        };

        await prisma.$transaction(async (prisma) => {
            await prisma.organizers.update({
                where: {
                    id: findUser!.id,
                },
                data: {
                    failedLogins: 0,
                },
            });
        });

        if (findUser.emailVerified === false) {

            const emailpayload = {
                email: email
            };
            const token = sign(emailpayload, String(SECRET_KEY2), { expiresIn: "3hr" });
            
            const templatePath = path.join(
                __dirname,
                "../mailer/email_templates",
                "registerOrganizer.hbs"
            );
    
            const templateSource = fs.readFileSync(templatePath, "utf-8");
            const compiledTemplate = Handlebars.compile(templateSource);
            const name = findUser.name
            const verifyURL: String = String(BASE_WEB_URL) + "/verifysignup/organizer" + "/" + token;
            const html = compiledTemplate({ email, name, verifyURL });
    
            await transporter.sendMail({
                to: email,
                subject: "ConcertHub Organizer Registration Confirmation",
                html: html,
            });

            throw new Error("Email not verified: A new verification email has been sent.");
        };

        const payload = {
            id: findUser.id,
            email: email,
            name: findUser.name,
            role: "organizer",
        };
        const token = sign(payload, String(SECRET_KEY))

        res.status(200)
        .cookie("access_token", token, { expires: new Date(new Date().valueOf() + 2400000) })
        .send({
            message: "Login successful!",
        });

    } catch(err) {
        next(err);
    };
};

async function GetOrganizerNameByID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const findOrganizer = await prisma.organizers.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!findOrganizer) {
            throw new Error("Organizer not found with ID!");
        };

        res.status(200).send({
            message: "Organizer found",
            data: findOrganizer.name,
        });

    } catch (err) {
        next(err);
    };
};

async function GetEventDiscountDataByEventID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("ID error!")
        };

        const findEvent = await prisma.events.findUnique({
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
        };

        res.status(200).send({
            message: "Discount data retrieved",
            data: {limited: findEvent.discountLimited, deadline: findEvent.discountDeadline},
        });

    } catch (err) {
        next(err);
    };
};

async function GetRatingsDataByEventID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("ID error!")
        };

        const findRatings = await prisma.event_Ratings.findMany({
            where: {
                eventID: parseInt(id),
            },
        });

        if (!findRatings) {
            throw new Error("EventID not found!");
        };

        res.status(200).send({
            message: "Ratings retrieved",
            data: findRatings,
        });

    } catch (err) {
        next(err);
    };
};

async function GetOrganizerDataByOrganizerID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("ID error!")
        };

        const findOrganizer = await prisma.organizers.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!findOrganizer) {
            throw new Error("OrganizerID not found!");
        };

        res.status(200).send({
            message: "Organizer retrieved",
            data: findOrganizer,
        });

    } catch (err) {
        next(err);
    };
};

async function RegisterEventByOrganizerID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            eventDate,
            overview,
            genre,
            venue,
            eventDesc,
            maxNormals,
            maxVIPs,
            normalPrice,
            VIPPrice,
            discountType
        } = req.body;
        
        let newEvent;

        await prisma.$transaction(async (prisma) => {
            newEvent = await prisma.events.create({
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
        });
    
        res.status(200).send({
            message: "Event creation successful!",
            data: newEvent,
        });

    } catch(err) {
        next(err);
    };
};

export async function GetAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await prisma.events.findMany({
        });
        res.status(200).send({
            message: "Events fetched",
            data: data,
        });
    } catch (err) {
        next(err);
    };
};

export {
    RegisterUser,
    VerifyUser,
    LoginUser,
    GetCouponDataByUserID,
    GetPointDataByUserID,
    GetHistoryDataByUserID,
    RegisterOrganizer,
    VerifyOrganizer,
    LoginOrganizer,
    GetOrganizerNameByID,
    GetEventDataByEventID,
    GetEventDataByOrganizerID,
    GetTransactionDataByTransactionID,
    GetTransactionDataByEventID,
    GetEventDiscountDataByEventID,
    GetRatingsDataByEventID,
    GetOrganizerDataByOrganizerID,
    RegisterEventByOrganizerID,
    // UploaderAssist,
    // UploadUpdate,
};