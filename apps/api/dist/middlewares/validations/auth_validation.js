"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterValidationOrganizer = exports.RegisterValidationUser = void 0;
const express_validator_1 = require("express-validator");
const RegisterValidationUser = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2 })
        .withMessage("First name must contain at least 2 characters"),
    (0, express_validator_1.body)("lastName")
        .optional({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage("Last name must contain at least 2 characters"),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Passwords must contain at least 6 characters")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
        .withMessage("Passwords must contain at least 6 characters, at least one letter, one number, and one special character."),
    (0, express_validator_1.body)("referralCode")
        .optional({ checkFalsy: true })
        .isLength({ min: 15, max: 15 })
        .withMessage("Referral codes contain exactly 15 characters")
        .matches(/^[A-Z0-9]+$/)
        .withMessage("Referral code contains only uppercase letters and numbers"),
    (req, res, next) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new Error(errors.array()[0].msg);
            }
            ;
            next();
        }
        catch (err) {
            next(err);
        }
        ;
    },
];
exports.RegisterValidationUser = RegisterValidationUser;
const RegisterValidationOrganizer = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must contain at least 2 characcters"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Passwords must contain at least 6 characters")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
        .withMessage("Passwords must contain at least 6 characters, at least one letter, one number, and one special character."),
    (req, res, next) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new Error(errors.array()[0].msg);
            }
            ;
            next();
        }
        catch (err) {
            next(err);
        }
        ;
    },
];
exports.RegisterValidationOrganizer = RegisterValidationOrganizer;
