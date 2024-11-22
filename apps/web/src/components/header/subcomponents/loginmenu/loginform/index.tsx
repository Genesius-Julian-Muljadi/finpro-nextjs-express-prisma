"use client";

import { Field, Form, Formik, FormikProps } from "formik";
import axios from "axios";
import { apiURL } from "../../../../../../../constants"
import { LoginSchema } from "../schema";
import { IUser } from "@/interfaces/loginform";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toggleMenu } from "@/redux/slices/togglemenu";

export default function LoginForm() {
    let n = useSelector((state: {LRSSlice: {actionSelected: number}}) => state.LRSSlice.actionSelected);
    const dispatch = useDispatch();

    const postLogin = async (params: IUser) => {
        try {
            console.log(apiURL);
            let API: string = apiURL + "/auth";
            if (n === 1) {
                API += "/loginuser";
            } else if (n === 2) {
                API += "/loginorganizer";
            } else {
                throw new Error("Invalid slice value: " + n);
            }
            console.log(API);
            // console.log(params.name + " " + params.email + " " + params.password);
            const output = await axios.post(API, {
                email: params.email,
                password: params.password,
            }, { withCredentials: true });
            
            console.log(output);
            dispatch(toggleMenu('reset'));
        } catch(err) {
            console.log(err);
        };
    };

    return (
        <div>
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={LoginSchema}
                onSubmit={(values) => {
                    // console.log(values);
                    postLogin(values);
                }}>
                {(props: FormikProps<IUser>) => {
                    const { values, errors, touched, handleChange } = props;

                    return (
                        <Form className="flex flex-col gap-4">
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
                            <button type="submit" className="rounded-md border border-black m-auto py-1 px-5 bg-sky-100 shadow-sm shadow-slate-300 mt-4" aria-label="Log in button">
                                Log in
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};