"use client";

import { Field, Form, Formik, FormikProps } from "formik";
import { EventSchema } from "./schema";
import axios from "axios";
import { CreateEvent } from "@/interfaces/createevent";

export default function CreateEventView() {
    // const postEvent = async (params: CreateEvent) => {
    //     try {
    //         let API: string = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";
    //         if (n === 1) {
    //             API += "/loginuser";
    //         } else if (n === 2) {
    //             API += "/loginorganizer";
    //         } else {
    //             throw new Error("Invalid slice value: " + n);
    //         }
    //         console.log(API);
    //         // console.log(params.name + " " + params.email + " " + params.password);
    //         const output = await axios.post(API, {
    //             email: params.email,
    //             password: params.password,
    //         }, { withCredentials: true });
            
    //         console.log(output);

    //         const isLoginPage = window.location.href.startsWith(process.env.NEXT_PUBLIC_BASE_WEB_URL + "/login");
    //         if (isLoginPage) {
    //             const loginMenu = document.getElementById("loginmenudiv") as HTMLDivElement;
    //             loginMenu.style.display = "none";
    //             router.push("/");
    //         };

    //         dispatch(toggleMenu('reset'));
    //     } catch(err) {
    //         console.log(err);
    //     };
    // };

    return (
        <div className="flex mx-6">
            {/* <div className="flex flex-col gap-4 mx-auto">
                <Formik
                    initialValues={{
                        image: "",
                        title: "",
                        eventDate: new Date(),
                        overview: "",
                        genre: "Other",
                        venue: "",
                        eventDesc: "",
                        maxNormals: null,
                        maxVIPs: 0,
                        normalPrice: 0,
                        VIPPrice: null,
                        discountType: "None",
                    }}
                    validationSchema={EventSchema}
                    onSubmit={(values) => {
                        // console.log(values);
                        postEvent(values);
                    }}>
                    {(props: FormikProps<CreateEvent>) => {
                        const { values, errors, touched, handleChange } = props;

                        return (
                            <Form className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="image" className="text-sm">Email </label>
                                    <Field type="text" name="image" onChange={handleChange} values={values.image} placeholder="image input placeholder" aria-label="Image upload"
                                        className="border border-black rounded-md px-2" />
                                    {touched.image && errors.image ? (
                                        <div className="text-xs text-red-600">{errors.image}</div>
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
            </div> */}
        </div>
    );
};