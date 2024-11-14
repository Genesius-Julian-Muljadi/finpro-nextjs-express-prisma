"use client";

import { Field, Form, Formik, FormikProps } from "formik";
// import "./style.css"
import IUser from "@/interfaces/user.interfaces";
import SignupSchema from "./schema";
import axios from "axios";
import { apiURL } from "../../../../../../constants"

export default function SignupMenu() {
    const postUser = async (params: IUser) => {
        try {
            console.log(apiURL);
            const API: string = apiURL + "/auth";
            console.log(API);
            await axios.post(API + "/registeruser", {
                firstName: params.firstName,
                lastName: params.lastName,
                email: params.email,
                password: params.password,
            }
            );
        } catch(err) {
            console.log(err);
        };
    };

    return (
        <div className="fixed grid h-screen w-screen" id="signupmenu">
            <div className="my-auto mx-2 sm:mx-auto h-[480px] max-w-full sm:w-[640px] shadow-sm shadow-slate-700 bg-neutral-100 place-content-center" aria-label="Sign Up Menu">
                <div className="mx-2 sm:mx-8 my-2 flex flex-col">
                    <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(values) => {
                        console.log(values);
                        postUser(values);
                    }}>
                        {(props: FormikProps<IUser>) => {
                            const { values, errors, touched, handleChange } = props;

                            return (
                                <Form className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="firstName" className="text-sm">First name </label>
                                        <Field type="text" name="firstName" onChange={handleChange} values={values.firstName}
                                        className="border border-black rounded-md px-2" />
                                        {/* touched is also valid if field is focused from anywhere */}
                                        {touched.firstName && errors.firstName ? (
                                            <div className="text-sm text-red-600">{errors.firstName}</div>
                                        ) : null}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="lastName" className="text-sm">Last name </label>
                                        <Field type="text" name="lastName" onChange={handleChange} values={values.lastName}
                                        className="border border-black rounded-md px-2" />
                                        {touched.lastName && errors.lastName ? (
                                            <div>{errors.lastName}</div>
                                        ) : null}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="email" className="text-sm">Email </label>
                                        <Field type="text" name="email" onChange={handleChange} values={values.email}
                                        className="border border-black rounded-md px-2" />
                                        {touched.email && errors.email ? (
                                            <div>{errors.email}</div>
                                        ) : null}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="password" className="text-sm">Password </label>
                                        <Field type="password" name="password" onChange={handleChange} values={values.password}
                                        className="border border-black rounded-md px-2" />
                                        {touched.password && errors.password ? (
                                            <div>{errors.password}</div>
                                        ) : null}
                                    </div>
                                    <button type="submit" className="rounded-md border border-black m-auto py-1 px-3">Sign Up</button>
                                </Form>
                            );
                        }}
                    </Formik>
                    <button className="size-4 border border-black" onClick={() => {console.log("button pressed")}} />
                </div>
            </div>
        </div>
    );
};