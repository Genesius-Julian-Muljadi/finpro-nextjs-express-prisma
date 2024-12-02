import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const RegisterValidationUser = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2 })
        .withMessage("First name must contain at least 2 characters"),
    body("lastName")
        .optional({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage("Last name must contain at least 2 characters"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Passwords must contain at least 6 characters")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
        .withMessage("Passwords must contain at least 6 characters, at least one letter, one number, and one special character."),
    body("referralCode")
        .optional({ checkFalsy: true })
        .isLength({ min: 15, max: 15 })
        .withMessage("Referral codes contain exactly 15 characters")
        .matches(/^[A-Z0-9]+$/)
        .withMessage("Referral code contains only uppercase letters and numbers"),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new Error(errors.array()[0].msg);
            };
            next();
        } catch (err) {
            next(err);
        };
    },
];

const RegisterValidationOrganizer = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must contain at least 2 characcters"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Passwords must contain at least 6 characters")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
        .withMessage("Passwords must contain at least 6 characters, at least one letter, one number, and one special character."),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new Error(errors.array()[0].msg);
            };
            next();
        } catch (err) {
            next(err);
        };
    },
];

export {
    RegisterValidationUser,
    RegisterValidationOrganizer,
};