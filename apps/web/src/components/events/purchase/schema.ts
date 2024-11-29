import { object, string } from "yup";

const PurchaseSchema = object({
    email: string()
        .email("Invalid email format.")
        .required("Please input your email."),
    password: string()
        .min(6, "Password contains at least 6 characters.")
        .required("Please input a password.")
});

export { 
    PurchaseSchema
};