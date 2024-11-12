import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const RegisterValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must contain at least 3 characcters"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 8 characters")
        .matches(/^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/)
        .withMessage("Passwords must have at least 8 characters, and at least 1 special character"),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                throw new Error(errors.array()[0].msg);
            };

            next();
        } catch (err) {
            next(err);
        };
    },
];