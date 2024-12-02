"use client";

import { Field, Form, Formik, FormikProps } from "formik";
import { IUser } from "@/interfaces/signupform";
import axios from "axios";
import { SignupSchemaUser } from "../schema";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/redux/slices/togglemenu";

export default function SignupMenuUser() {
    const dispatch = useDispatch()

    const postUser = async (params: IUser) => {
        try {
            const API: string = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";
            const output = await axios.post(API + "/registeruser", {
                firstName: params.firstName,
                lastName: params.lastName,
                email: params.email,
                password: params.password,
                referralCode: params.referralCode,
            });
        } catch(err) {
            console.log(err);
        };
    };

    return (
        <div className="">
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    referralCode: "",
                }}
                validationSchema={SignupSchemaUser}
                onSubmit={(values) => {
                    postUser(values);
                }}>
                {(props: FormikProps<IUser>) => {
                    const { values, errors, touched, handleChange } = props;

                    return (
                        <Form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="firstName" className="text-sm">First name </label>
                                <Field type="text" name="firstName" onChange={handleChange} values={values.firstName} placeholder="Type first name here" aria-label="First name text box"
                                    className="border border-black rounded-md px-2" />
                                {touched.firstName && errors.firstName ? (
                                    <div className="text-xs text-red-600">{errors.firstName}</div>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="lastName" className="text-sm">Last name (Optional) </label>
                                <Field type="text" name="lastName" onChange={handleChange} values={values.lastName} placeholder="Type last name here (optional)" aria-label="Optional last name text box"
                                    className="border border-black rounded-md px-2" />
                                {touched.lastName && errors.lastName ? (
                                    <div className="text-xs text-red-600">{errors.lastName}</div>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="text-sm">Email </label>
                                <Field type="text" name="email" onChange={handleChange} values={values.email} placeholder="example@domain.com" aria-label="E-mail text box"
                                    className="border border-black rounded-md px-2" />
                                {touched.email && errors.email ? (
                                    <div className="text-xs text-red-600">{errors.email}</div>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="password" className="text-sm">Password </label>
                                <Field type="password" name="password" onChange={handleChange} values={values.password} placeholder="Type password here" aria-label="Password text box"
                                    className="border border-black rounded-md px-2" />
                                {touched.password && errors.password ? (
                                    <div className="text-xs text-red-600">{errors.password}</div>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="referralCode" className="text-sm">Referral code (Optional) </label>
                                <Field type="text" name="referralCode" onChange={handleChange} values={values.referralCode} placeholder="Referral code from another participant" aria-label="Optional referral code text box"
                                    className="border border-black rounded-md px-2" />
                                {touched.referralCode && errors.referralCode ? (
                                    <div className="text-xs text-red-600">{errors.referralCode}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="rounded-md border border-black m-auto py-1 px-5 bg-sky-100 shadow-sm shadow-slate-300 mt-4" aria-label="Sign up button"
                                onClick={() => {dispatch(toggleMenu('reset'))}}>
                                Sign Up
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};