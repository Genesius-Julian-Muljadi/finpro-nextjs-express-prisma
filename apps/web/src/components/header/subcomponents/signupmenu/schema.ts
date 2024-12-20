import { object, string } from "yup";

const SignupSchemaUser = object({
    firstName: string()
        .notOneOf(['admin'], "First name cannot be admin")
        .min(2, "First name must contain at least 2 characters.")
        .max(30, "First name cannot exceed 30 characters.")
        .required("First name is required."),
    lastName: string()
        .min(2, "Last name must contain at least 2 characters.")
        .max(30, "Last name cannot exceed 30 characters.")
        .notRequired(),
    email: string()
        .trim()
        .email("Invalid email format.")
        .required("Email is required."),
    password: string()
        .trim()
        .min(6, "Passwords must contain at least 6 characters.")
        .max(50, "Passwords cannot exceed 50 characters.")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,50}$/, "Passwords must contain at least 6 characters, at least one letter, one number, and one special character.")
        .required("Please input a password."),
    referralCode: string()
        .max(15, "Referral codes cannot exceed 15 characters")
        .notRequired(),
});

const SignupSchemaOrganizer = object({
    name: string()
        .notOneOf(['admin'], "Name cannot be admin")
        .min(2, "Name must contain at least 2 characters.")
        .max(30, "Name cannot exceed 30 characters.")
        .required("Name is required."),
    email: string()
        .trim()
        .email("Invalid email format.")
        .required("Email is required."),
    password: string()
        .trim()
        .min(6, "Passwords must contain at least 6 characters.")
        .max(50, "Passwords cannot exceed 50 characters.")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,50}$/, "Passwords must contain at least 6 characters, at least one letter, one number, and one special character.")
        .required("Please input a password."),
});

export {
    SignupSchemaUser,
    SignupSchemaOrganizer,
};