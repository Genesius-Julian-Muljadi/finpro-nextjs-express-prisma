import { Request, Response, NextFunction } from "express";
import { ADMIN_EMAIL, SECRET_KEY, SECRET_KEY2 } from "../config/index";
import { Organizer, User } from "../custom";
import { verify } from "jsonwebtoken";

async function VerifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error("Unauthorized access");
        };

        const user = verify(token, String(SECRET_KEY));
        if (!user) {
            throw new Error("Unauthorized access: Key mismatch");
        };

        req.user = user as User;

        next();

    } catch(err) {
        next(err);
    };
};

async function VerifyTokenOrganizerSignup(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token received: " + token);
        if (!token) {
            throw new Error("Unauthorized access");
        };

        const organizer = verify(token, String(SECRET_KEY2));
        console.log(organizer);
        if (!organizer) {
            throw new Error("Unauthorized access: Key mismatch");
        };

        req.organizer = organizer as Organizer;

        next();

    } catch(err) {
        next(err);
    };
};

async function AdminGuard(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user?.email !== ADMIN_EMAIL) {
            throw new Error("Unauthorized access: Admin required");
        };

        next();

    } catch(err) {
        next(err);
    };
};

export {
    VerifyToken,
    VerifyTokenOrganizerSignup,
    AdminGuard,
};