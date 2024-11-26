"use client";

import { Field, Form, Formik, FormikProps } from "formik";
import { EventSchema } from "./schema";
import axios from "axios";
import { CreateEvent } from "@/interfaces/createevent";
import VerifyTokenClient from "@/functions/verifytokenclient";
import { useEffect, useState } from "react";

export default function CreateEventView() {
    // const [artistCount, setCount] = useState<number>(1);
    // let currentCount = 0;

    // function removeInput() {
    //     const e = document.activeElement?.parentElement;
    //     if (e) {
    //         e.remove();
    //     };
    // };

    // useEffect(() => {
    //     if (artistCount === currentCount) {
    //         console.log("same count!?");
    //     } else if (artistCount > currentCount) {
    //         const form = document.getElementById("artistinputform") as HTMLFormElement;
    //         const artistInput = document.createElement("div");
    //         artistInput.className = "w-full flex flex-col gap-6";

    //         const input = document.createElement("input");
    //         input.type = "text";
    //         input.name = `artist${artistCount}`;
    //         input.className = "border border-black rounded-md px-2 artistinputclass";
    //         // input.id = `artistinput${artistCount}`;
    //         artistInput.appendChild(input);

    //         document.getElementsByClassName("")

    //         form.appendChild(artistInput)

    //         currentCount = artistCount;
    //     } else {
    //         currentCount = artistCount;
    //     };
    // }, [artistCount]);

    const decodedToken = VerifyTokenClient();
    if (!decodedToken) {
        console.log("No token found");
        throw new Error("No token found!");
    };
    
    const postEvent = async (params: CreateEvent) => {
        try {
            const API: string = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";
            const output = await axios.post(API + "/registerevent/" + decodedToken?.id, {
                image: params.image,
                title: params.title,
                eventDate: params.eventDate,
                overview: params.overview,
                genre: params.genre,
                venue: params.venue,
                eventDesc: params.eventDesc,
                maxNormals: params.maxNormals,
                maxVIPs: params.maxVIPs,
                normalPrice: params.normalPrice,
                VIPPrice: params.VIPPrice,
                discountType: params.discountType,
            });
            
            console.log(output);
        } catch(err) {
            console.log(err);
        };
    };

    return (
        <div className="flex mx-6">
            <div className="flex flex-col w-[85%] mx-auto">
                <Formik
                    initialValues={{
                        image: "",
                        title: "",
                        eventDate: new Date(),
                        overview: "",
                        genre: "Other",
                        venue: "",
                        eventDesc: "",
                        maxNormals: 0,
                        maxVIPs: 0,
                        normalPrice: 0,
                        VIPPrice: 0,
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
                            <Form className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="image" className="text-sm">Image </label>
                                    <Field type="text" name="image" onChange={handleChange} values={values.image} placeholder="image input placeholder" aria-label="Image upload"
                                        className="border border-black rounded-md px-2" />
                                    {touched.image && errors.image ? (
                                        <div className="text-xs text-red-600">{errors.image}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="title" className="text-sm">Event title </label>
                                    <Field type="text" name="title" onChange={handleChange} values={values.title} placeholder="Event title..." aria-label="Event title text box"
                                        className="border border-black rounded-md px-2" />
                                    {touched.title && errors.title ? (
                                        <div className="text-xs text-red-600">{errors.title}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="eventDate" className="text-sm">Event date </label>
                                    <Field type="datetime-local" name="eventDate" onChange={handleChange} values={values.eventDate} aria-label="Select an event date and time"
                                        className="border border-black rounded-md px-2" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="overview" className="text-sm">Overview </label>
                                    <Field type="text" name="overview" onChange={handleChange} values={values.overview} placeholder="Brief overview of the event..." aria-label="Event overview text box"
                                        className="border border-black rounded-md px-2 h-20 text-wrap" />
                                    {touched.overview && errors.overview ? (
                                        <div className="text-xs text-red-600">{errors.overview}</div>
                                    ) : null}
                                </div>
                                {/* Artists input form */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="genre" className="text-sm">Genre </label>  {/* Should be a radio input */}
                                    <Field type="text" name="genre" onChange={handleChange} values={values.genre} placeholder="Classical, Jazz, Pop, etc..." aria-label="Genre text box"
                                        className="border border-black rounded-md px-2" />
                                    {touched.genre && errors.genre ? (
                                        <div className="text-xs text-red-600">{errors.genre}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="venue" className="text-sm">Venue </label>  {/* Should be a search input */}
                                    <Field type="text" name="venue" onChange={handleChange} values={values.venue} placeholder="Venue for your event..." aria-label="Venue text box"
                                        className="border border-black rounded-md px-2" />
                                    {touched.venue && errors.venue ? (
                                        <div className="text-xs text-red-600">{errors.venue}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="eventDesc" className="text-sm">Description </label>
                                    <Field type="text" name="eventDesc" onChange={handleChange} values={values.eventDesc} placeholder="Describe your event..." aria-label="Event description text box"
                                        className="border border-black rounded-md px-2 h-20" />
                                    {touched.eventDesc && errors.eventDesc ? (
                                        <div className="text-xs text-red-600">{errors.eventDesc}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="maxNormals" className="text-sm">Max. Regular Participants (Unlimited if left at 0) </label>
                                    <Field type="number" name="maxNormals" onChange={handleChange} values={values.maxNormals} aria-label="Maximum regular participants: Unlimited if left 0"
                                        className="border border-black rounded-md px-2" />
                                    {touched.maxNormals && errors.maxNormals ? (
                                        <div className="text-xs text-red-600">{errors.maxNormals}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="maxVIPs" className="text-sm">Max. VIPs </label>
                                    <Field type="number" name="maxVIPs" onChange={handleChange} values={values.maxVIPs} placeholder="0" aria-label="Maximum regular participants: 0 by default"
                                        className="border border-black rounded-md px-2" />
                                    {touched.maxVIPs && errors.maxVIPs ? (
                                        <div className="text-xs text-red-600">{errors.maxVIPs}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="normalPrice" className="text-sm">Regular Price </label>
                                    <Field type="number" name="normalPrice" onChange={handleChange} values={values.normalPrice} placeholder="0" aria-label="Regular price number input"
                                        className="border border-black rounded-md px-2" />
                                    {touched.normalPrice && errors.normalPrice ? (
                                        <div className="text-xs text-red-600">{errors.normalPrice}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="VIPPrice" className="text-sm">VIP Price </label>
                                    <Field type="number" name="VIPPrice" onChange={handleChange} values={values.VIPPrice} placeholder="0" aria-label="VIP price number input"
                                        className="border border-black rounded-md px-2" />
                                    {touched.VIPPrice && errors.VIPPrice ? (
                                        <div className="text-xs text-red-600">{errors.VIPPrice}</div>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="discountType" className="text-sm">Discount Type </label>  {/* Should be a radio input that introduces more fields depending on selection */}
                                    <Field type="text" name="discountType" onChange={handleChange} values={values.discountType} placeholder="None, Limited, Deadline, Limited & Deadline" aria-label="Genre text box"
                                        className="border border-black rounded-md px-2" />
                                    {touched.discountType && errors.discountType ? (
                                        <div className="text-xs text-red-600">{errors.discountType}</div>
                                    ) : null}
                                </div>
                                <button type="submit" className="rounded-md border border-black m-auto py-1 px-5 bg-sky-100 shadow-sm shadow-slate-300 mt-4" aria-label="Log in button">
                                    Create
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};