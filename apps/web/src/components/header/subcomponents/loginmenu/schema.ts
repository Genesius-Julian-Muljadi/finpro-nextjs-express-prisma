import { object, string } from "yup";

const LoginSchema = object({
    email: string()
        .email("Invalid email format.")
        .required("Please input your email."),
    password: string()
        .min(6, "Password contains at least 6 characters.")
        .required("Please input a password.")
});

export { 
    LoginSchema
};