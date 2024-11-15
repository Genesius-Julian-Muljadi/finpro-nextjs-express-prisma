import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY, SECRET_KEY2 } from "../config/index";
import { Organizer } from "../custom.d";
import { transporter } from "../mailer/mail";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";

const prisma = new PrismaClient();

async function RegisterUser(req: Request, res: Response, next: NextFunction) {
    // Don't forget to add input validation!
    // Currently has no such validation
    try {
        const { email, firstName, lastName, password } = req.body;
        console.log("Request body received: " + email + " " + firstName + " " + lastName + " " + "some password");

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
        console.log("salt and hash created");
        let refCode = await hash(email, salt);  // Generate pseudo-random refCode using unique emails
        refCode = refCode.replace(/[^\w\s]/gi, '');
        refCode = refCode.slice(refCode.length - 15, refCode.length).toUpperCase();
        console.log("refCode created" + " " + refCode);
        
        let newUser;

        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started");
            newUser = await prisma.users.create({
                data: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: hashPassword,
                    referralCode: refCode,
                }
            });
            console.log("prisma transaction concluded");
        });
        
        // const templatePath = path.join(
        //     __dirname,
        //     "../mailer/email_templates",
        //     "registerUser.hbs"
        // );
        // const templateSource = fs.readFileSync(templatePath, "utf-8");
        // const compiledTemplate = Handlebars.compile(templateSource);
        // const html = compiledTemplate({ email, firstName });

        // await transporter.sendMail({
        //     to: email,
        //     subject: "ConcertHub Registration Confirmation",
        //     html: html,
        // });
    
        console.log("User registration added to database");
        res.status(200).send({
            message: "Register successful!",
            data: newUser,
        });

    } catch(err) {
        next(err);
    };
};

async function LoginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const findUser = await prisma.users.findUnique({
            where: {
                email: email,
            }
        });
        if (!findUser) {
            throw new Error("Invalid credentials");
        };

        const passwordMatches = await compare(password, findUser.password);
        if (!passwordMatches) {
            throw new Error("Invalid credentials");
        };

        const payload = {
            email: email,
        };
        const token = sign(payload, String(SECRET_KEY), { expiresIn: 1200 })

        res.status(200).send({
            message: "Login successful!",
            access_token: token,
        });

    } catch(err) {
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
            console.log("prisma transaction started");
            newOrganizer = await prisma.organizers.create({
                data: {
                    email: email,
                    name: name,
                    password: hashPassword,
                }
            });
            console.log("prisma transaction concluded");
        });
        
        const templatePath = path.join(
            __dirname,
            "../mailer/email_templates",
            "registerOrganizer.hbs"
        );
        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = Handlebars.compile(templateSource);
        const html = compiledTemplate({ email, name });

        await transporter.sendMail({
            to: email,
            subject: "ConcertHub Organizer Registration Confirmation",
            html: html,
        });

        const payload = {
            email: email
        };
        const token = sign(payload, String(SECRET_KEY2))  // no expiration
    
        console.log("User registration added to database");
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
        console.log(email);
        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started");
            await prisma.organizers.update({
                where: {
                    email: email,
                },
                data: {
                    emailVerified: true,
                },
            });
            console.log("prisma transaction ended");
        });

        res.status(200).send({
            message: "Email verified",
        });
    } catch (err) {
        next(err);
    };
};

export {
    RegisterUser,
    LoginUser,
    // UploaderAssist,
    // UploadUpdate,
    RegisterOrganizer,
    VerifyOrganizer,
};