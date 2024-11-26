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
    // Don't forget to add input validation!
    // Currently has no such validation
    try {
        const { email, firstName, lastName, password, referralCode } = req.body;
        console.log("Request body received: " + email + " " + firstName + " " + lastName + " " + "some password");
        console.log(referralCode);
        if (referralCode) {
            console.log("Referral code received: " + referralCode);
            const findRefCode = await prisma.users.findUnique({
                where: {
                    referralCode: referralCode,
                },
            });
            if (!findRefCode) {
                throw new Error("Referral code is not valid");
            };
        } else {
            console.log("Referral code not used");
        };

        const findUser = await prisma.users.findUnique({
            where: {
                email: email,
            }
        });
        if (findUser) {
            console.log("Duplicate email error");
            console.log(findUser);
            throw new Error("Email already exists");
        };

        const salt = await genSalt(10);
        const hashPassword = await hash(password, salt);
        console.log("salt and hash created");

        let refCode: string = "";

        async function generateUniqueRefCode() {
            refCode = await hash(email, salt);  // Generate pseudo-random refCode using unique emails
            refCode = refCode.replace(/[^\w\s]/gi, '');
            refCode = refCode.slice(refCode.length - 15, refCode.length).toUpperCase();

            // Uniqueness validation
            let findRefCode = await prisma.users.findUnique({
                where: {
                    referralCode: refCode,
                },
            });

            function incrementString(str: string): string {
                // 0-9, then A-Z. If already Z, then go to 0 and increment next char to the left.
                // if all chars are Z, increment to all 0
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
                console.log("Duplicate refCode found: " + refCode);
                incrementString(refCode);
                findRefCode = await prisma.users.findUnique({
                    where: {
                        referralCode: refCode,
                    },
                });
            };

            console.log("Unique refCode created: " + refCode);
        };
        await generateUniqueRefCode();

        let newUser;

        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started: creating user data");
            newUser = await prisma.users.create({
                data: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: hashPassword,
                    referralCode: refCode,
                }
            });

            console.log("prisma transaction successful: user data created");
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
        console.log("Email sent");
    
        console.log("User registration added to database");
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
        console.log("Email from JSON Web Token: " + email);
        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started: verifying email in database");
            const newUser = await prisma.users.update({
                where: {
                    email: email,
                },
                data: {
                    emailVerified: true,
                },
            });

            if (refCode !== "") {
                console.log("referral code valid: adding referral code bonuses");
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
                console.log("discount coupon created");

                const expiryDate: Date = new Date();
                expiryDate.setDate(expiryDate.getDate() + 90);
                await prisma.point_Balance.create({
                    data: {
                        user1ID: findRefCode!.id,
                        user2ID: newUser.id,
                        expiryDate: expiryDate,
                    },
                });
                console.log("point balance data added");

                await prisma.users.update({
                    where: {
                        id: findRefCode!.id,
                    },
                    data: {
                        pointBalance: findRefCode!.pointBalance + 10000,
                    },
                });
                console.log("point balance updated for referrer");

                console.log("referral code bonuses added");
            };
            console.log("prisma transaction ended: emailVerified updated in database");
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
        console.log("request body received: " + email);
        const findUser = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!findUser) {
            console.log("email not found in database");
            throw new Error("Invalid credentials");
        };
        console.log("email found");

        if (findUser.active === "Locked") {
            console.log("Account locked: Too many failed logins")
            throw new Error("Account locked: Please contact an administrator");
        };

        const passwordMatches = await compare(password, findUser.password);
        if (!passwordMatches) {
            console.log("incorrect password")
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
            console.log("incremented failedLogins");

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
        console.log("password matches");

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
            // pointHistory: findUser.codeUsed,
            // transactionHistory: findUser.history,  // Non-refunded transactions only
            // coupons: findUser.coupons,
        };
        const token = sign(payload, String(SECRET_KEY))
        console.log("token created")

        // throw new Error("test complete");

        console.log("login successful: access token cookied")
        res.status(200)
        .cookie("access_token", token, { expires: new Date(new Date().valueOf() + 2400000) })
        // .cookie("access_token_session", token)  // Session cookie
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

async function RegisterOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, name, password } = req.body;
        console.log("Request body received: " + email + " " + name + " " + "some password");

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
        console.log("salt and hash created");
        
        let newOrganizer;

        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started: creating organizer data");
            newOrganizer = await prisma.organizers.create({
                data: {
                    email: email,
                    name: name,
                    password: hashPassword,
                }
            });
            console.log("prisma transaction concluded: organizer data created");
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
        console.log("verification email sent");
    
        console.log("Organizer registration added to database");
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
        console.log("Email from JSON Web Token: " + email);
        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started: verifying email in database");
            await prisma.organizers.update({
                where: {
                    email: email,
                },
                data: {
                    emailVerified: true,
                },
            });
            console.log("prisma transaction ended: emailVerified updated in database");
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
        console.log("request body received");
        const findUser = await prisma.organizers.findUnique({
            where: {
                email: email,
            }
        });
        if (!findUser) {
            throw new Error("Invalid credentials");
        };
        console.log("email found");

        if (findUser.failedLogins >= 5) {
            console.log("Account locked: Too many failed logins")
            throw new Error("Account locked: Please contact an administrator");
        };

        const passwordMatches = await compare(password, findUser.password);
        if (!passwordMatches) {
            throw new Error("Invalid credentials");
        };
        console.log("password matches");

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
            console.log("email not verified. attempting to resend verification email")

            const emailpayload = {
                email: email
            };
            const token = sign(emailpayload, String(SECRET_KEY2))  // no expiration
            
            const templatePath = path.join(
                __dirname,
                "../mailer/email_templates",
                "registerOrganizer.hbs"
            );
    
            const templateSource = fs.readFileSync(templatePath, "utf-8");
            const compiledTemplate = Handlebars.compile(templateSource);
            const verifyURL: String = String(BASE_WEB_URL) + "/verifysignup" + "/" + token;
            const html = compiledTemplate({ email, name, verifyURL });
    
            await transporter.sendMail({
                to: email,
                subject: "ConcertHub Organizer Registration Confirmation",
                html: html,
            });
            console.log("verification email sent");

            res.status(200).send({
                message: "A verification email has been sent. Please verify your email before you can log in."
            });
        };

        const payload = {
            id: findUser.id,
            email: email,
            name: findUser.name,
            role: "organizer",
        };
        const token = sign(payload, String(SECRET_KEY))
        console.log("token created")

        // throw new Error("test complete");

        console.log("login successful: access token cookied")
        res.status(200)
        .cookie("access_token", token, { expires: new Date(new Date().valueOf() + 2400000) })
        // .cookie("access_token_session", token)  // Session cookie
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

// async function UploaderAssist(req: Request, res: Response, next: NextFunction) {
//     try {
//         const { file } = req;
//         const { name } = req.body;

//         console.log(file);
//         console.log(name);

//         if (!file) {
//             throw new Error("No file uploaded")
//         };

//         res.status(200).send({
//             message: "File uploaded",
//         });
//     } catch(err) {
//         next(err);
//     };
// };

// async function UploadUpdate(req: Request, res: Response, next: NextFunction) {
//     try {
//         const { file } = req;
//         const { email } = req.user as User;

//         console.log(file);
//         console.log(email);

//         if (!file) {
//             throw new Error("No file uploaded")
//         };

//         await prisma.users.update({
//             where: {
//                 email: email,
//             },
//             data: {
//                 image: file?.filename,
//             },
//         });

//         res.status(200).send({
//             message: "File uploaded",
//         });
//     } catch(err) {
//         next(err);
//     };
// };

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
        console.log("Request body received");
        console.log(image);
        console.log(title);
        console.log(new Date(eventDate));
        console.log(overview);
        console.log(genre);
        console.log(venue);
        console.log(eventDesc);
        console.log(maxNormals);
        console.log(maxVIPs);
        console.log(normalPrice);
        console.log(VIPPrice);
        console.log(discountType);
        
        let newEvent;

        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started: creating event data");
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
            console.log("prisma transaction concluded: event data created");
        });
    
        console.log("Event registration added to database");
        res.status(200).send({
            message: "Event creation successful!",
            data: newEvent,
        });

    } catch(err) {
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
    GetEventDiscountDataByEventID,
    RegisterEventByOrganizerID,
    // UploaderAssist,
    // UploadUpdate,
};