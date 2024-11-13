import { object, string } from "yup";

const Schema = object({
    // is a string input 
    firstName: string()
    // minimum input length
        .min(3, "First name must contain at least 3 characters.")
    // maximum input length
        .max(32, "First name cannot exceed 32 characters.")
    // is a required input. Cannot be blank
        .required("First name is required."),
    lastName: string()
        .min(3, "Last name must contain at least 3 characters.")
        .max(32, "Last name cannot exceed 32 characters.")
        .required("Last name is required."),
    email: string()
    // yup will check for email format with this method
        .email("Invalid email format.")
        .required("Email is required."),
    password: string()
        .min(4, "Password must contain at least 4 characters.")
    // RegEx for checking for at least 1 number and 1 special character
    // Should probably check what this RegEx means exactly...
        .matches(/^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/, "Password must contain at least 1 number and at least 1 special character.")
        .required("Password is required.")
});

export default Schema;