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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopulateUsers = PopulateUsers;
exports.PopulateOrganizers = PopulateOrganizers;
exports.GetAllUsers = GetAllUsers;
exports.GetAllOrganizers = GetAllOrganizers;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const prisma = new client_1.PrismaClient();
function PopulateUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, firstName, lastName, password } = req.body;
            let referralCode = "";
            const creationDate = new Date(new Date().valueOf() - (Math.random() * (1000 * 60 * 60 * 24 * 365 * 4)));
            if (Math.random() * 4 > 3) {
                const findUsersr = yield prisma.users.findMany({
                    where: {
                        active: "Active",
                    },
                });
                const findUsers = findUsersr.filter((item) => {
                    return new Date(item.dateCreated).valueOf() < creationDate.valueOf();
                });
                if (findUsers.length > 0) {
                    referralCode = findUsers[Math.floor(Math.random() * findUsers.length)].referralCode;
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
                console.log(findUser);
                throw new Error("Email already exists");
            }
            ;
            const salt = yield (0, bcrypt_1.genSalt)(10);
            const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
            console.log("salt and hash created");
            let refCode = "";
            function generateUniqueRefCode() {
                return __awaiter(this, void 0, void 0, function* () {
                    refCode = yield (0, bcrypt_1.hash)(email, salt); // Generate pseudo-random refCode using unique emails
                    refCode = refCode.replace(/[^\w\s]/gi, '');
                    refCode = refCode.slice(refCode.length - 15, refCode.length).toUpperCase();
                    // Uniqueness validation
                    let findRefCode = yield prisma.users.findUnique({
                        where: {
                            referralCode: refCode,
                        },
                    });
                    function incrementString(str) {
                        // 0-9, then A-Z. If already Z, then go to 0 and increment next char to the left.
                        // if all chars are Z, increment to all 0
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
                        console.log("Duplicate refCode found: " + refCode);
                        incrementString(refCode);
                        findRefCode = yield prisma.users.findUnique({
                            where: {
                                referralCode: refCode,
                            },
                        });
                    }
                    ;
                    console.log("Unique refCode created: " + refCode);
                });
            }
            ;
            yield generateUniqueRefCode();
            let newUser;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                console.log("prisma transaction started: creating user data");
                newUser = yield prisma.users.create({
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
                    const findRefCode = yield prisma.users.findUnique({
                        where: {
                            referralCode: referralCode,
                        },
                    });
                    yield prisma.coupons.create({
                        data: {
                            code: referralCode,
                            userID: newUser.id,
                        },
                    });
                    console.log("discount coupon created");
                    const expiryDate = new Date(newUser.dateCreated);
                    expiryDate.setDate(expiryDate.getDate() + 90);
                    yield prisma.point_Balance.create({
                        data: {
                            user1ID: findRefCode.id,
                            user2ID: newUser.id,
                            expiryDate: expiryDate,
                        },
                    });
                    console.log("point balance data added");
                    yield prisma.users.update({
                        where: {
                            id: findRefCode.id,
                        },
                        data: {
                            pointBalance: findRefCode.pointBalance + 10000,
                        },
                    });
                    console.log("point balance updated for referrer");
                    console.log("referral code bonuses added");
                }
                ;
                console.log("prisma transaction successful: user data created");
            }));
            console.log("User registration added to database");
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
function PopulateOrganizers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, name, password } = req.body;
            const creationDate = new Date(new Date().valueOf() - (Math.random() * (1000 * 60 * 60 * 24 * 365 * 4)));
            const findUser = yield prisma.users.findUnique({
                where: {
                    email: email,
                }
            });
            if (findUser) {
                console.log("Duplicate email error");
                console.log(findUser);
                throw new Error("Email already exists");
            }
            ;
            const salt = yield (0, bcrypt_1.genSalt)(10);
            const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
            console.log("salt and hash created");
            let newUser;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                console.log("prisma transaction started: creating user data");
                newUser = yield prisma.organizers.create({
                    data: {
                        email: email,
                        name: name,
                        password: hashPassword,
                        emailVerified: true,
                        dateCreated: creationDate,
                    }
                });
                console.log("prisma transaction successful: user data created");
            }));
            console.log("User registration added to database");
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
function GetAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prisma.users.findMany({
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
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
function GetAllOrganizers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prisma.organizers.findMany({
                where: {
                    active: "Active",
                },
            });
            res.status(200).send({
                message: "Organizers fetched",
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
