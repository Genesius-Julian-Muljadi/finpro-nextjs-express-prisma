import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const RegisterValidationUser = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("firstName")
        .notEmpty()
        .withMessage("First name is required")
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
            // console.log("error here?");
            const errors = validationResult(req);
            console.log(errors);
            // console.log("error here?");
            if (!errors.isEmpty()) {
                throw new Error(errors.array()[0].msg);
            };

            console.log("User info validation successful");
            next();
        } catch (err) {
            next(err);
        };
    },
];