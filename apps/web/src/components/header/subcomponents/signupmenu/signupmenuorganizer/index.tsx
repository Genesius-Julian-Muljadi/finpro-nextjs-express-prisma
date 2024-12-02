"use client";

import { Field, Form, Formik, FormikProps } from "formik";
import { IOrganizer } from "@/interfaces/signupform";
import axios from "axios";
import { SignupSchemaOrganizer } from "../schema";
import { toggleMenu } from "@/redux/slices/togglemenu";
import { useDispatch } from "react-redux";

export default function SignupMenuOrganizer() {
    const dispatch = useDispatch();
    
    const postOrganizer = async (params: IOrganizer) => {
        try {
            const API: string = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";
            const output = await axios.post(API + "/registerorganizer", {
                name: params.name,
                email: params.email,
                password: params.password,
            });
        } catch(err) {
            console.log(err);
        };
    };

    return (
        <div>
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                }}
                validationSchema={SignupSchemaOrganizer}
                onSubmit={(values) => {
                    postOrganizer(values);
                }}>
                {(props: FormikProps<IOrganizer>) => {
                    const { values, errors, touched, handleChange } = props;

                    return (
                        <Form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="text-sm">Name </label>
                                <Field type="text" name="name" onChange={handleChange} values={values.name} placeholder="Type organizer name here" aria-label="Organizer name text box"
                                    className="border border-black rounded-md px-2" />
                                {touched.name && errors.name ? (
                                    <div className="text-xs text-red-600">{errors.name}</div>
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