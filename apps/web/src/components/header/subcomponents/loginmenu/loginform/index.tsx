"use client";

import { Field, Form, Formik, FormikProps } from "formik";
import axios from "axios";
import { LoginSchema } from "../schema";
import { IUser } from "@/interfaces/loginform";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toggleMenu } from "@/redux/slices/togglemenu";

export default function LoginForm() {
    let n = useSelector((state: {LRSSlice: {actionSelected: number}}) => state.LRSSlice.actionSelected);
    const dispatch = useDispatch();
    const router = useRouter();

    const postLogin = async (params: IUser) => {
        try {
            let API: string = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";
            if (n === 1) {
                API += "/loginuser";
            } else if (n === 2) {
                API += "/loginorganizer";
            } else {
                throw new Error("Invalid slice value: " + n);
            }
            const output = await axios.post(API, {
                email: params.email,
                password: params.password,
            }, { withCredentials: true });

            const isLoginPage = window.location.href.startsWith(process.env.NEXT_PUBLIC_BASE_WEB_URL + "/login");
            if (isLoginPage) {
                const loginMenu = document.getElementById("loginmenudiv") as HTMLDivElement;
                loginMenu.style.display = "none";
                router.push("/");
            };

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
                            <button type="submit" className="rounded-md border border-black m-auto py-1 px-5 bg-sky-100 shadow-sm shadow-slate-300 mt-4" aria-label="Log in button"
                                onClick={() => {dispatch(toggleMenu('reset'))}}>
                                Log in
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};