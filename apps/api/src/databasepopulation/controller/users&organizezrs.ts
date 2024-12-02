import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

export async function PopulateUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, firstName, lastName, password } = req.body;

        let referralCode: string = "";
        const creationDate: Date = new Date(new Date().valueOf() - (Math.random() * (1000 * 60 * 60 * 24 * 365 * 4)));
        if (Math.random() * 4 > 3) {
            const findUsersr = await prisma.users.findMany({
                where: {
                    active: "Active",
                },
            });
            const findUsers = findUsersr.filter((item) => {
                return new Date(item.dateCreated).valueOf() < creationDate.valueOf();
            });
            if (findUsers.length > 0) {
                referralCode = findUsers[Math.floor(Math.random() * findUsers.length)].referralCode;
            };
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
                    emailVerified: true,
                    dateCreated: creationDate,
                }
            });

            if (referralCode) {
                console.log("referral code valid: adding referral code bonuses");
                const findRefCode = await prisma.users.findUnique({
                    where: {
                        referralCode: referralCode,
                    },
                });

                await prisma.coupons.create({
                    data: {
                        code: referralCode,
                        userID: newUser.id,
                    },
                });
                console.log("discount coupon created");

                const expiryDate: Date = new Date(newUser.dateCreated);
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

            console.log("prisma transaction successful: user data created");
        });
    
        console.log("User registration added to database");
        res.status(200).send({
            message: "Register successful!",
            data: newUser,
        });

    } catch(err) {
        next(err);
    };
};

export async function PopulateOrganizers(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, name, password } = req.body;

        const creationDate: Date = new Date(new Date().valueOf() - (Math.random() * (1000 * 60 * 60 * 24 * 365 * 4)));

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

        let newUser;

        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started: creating user data");
            newUser = await prisma.organizers.create({
                data: {
                    email: email,
                    name: name,
                    password: hashPassword,
                    emailVerified: true,
                    dateCreated: creationDate,
                }
            });

            console.log("prisma transaction successful: user data created");
        });
    
        console.log("User registration added to database");
        res.status(200).send({
            message: "Register successful!",
            data: newUser,
        });

    } catch(err) {
        next(err);
    };
};

export async function GetAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await prisma.users.findMany({
            where: {
                active: "Active",
            },
            include: {
                coupons: true,
                codeUsed: true,
            },
        });
        res.status(200).send({
            message: "Users fetched",
            data: data,
        });
    } catch (err) {
        next(err);
    };
};

export async function GetAllOrganizers(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await prisma.organizers.findMany({
            where: {
                active: "Active",
            },
        });
        res.status(200).send({
            message: "Organizers fetched",
            data: data,
        });
    } catch (err) {
        next(err);
    };
};