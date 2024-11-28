"use client";

import { Field, Form, Formik, FormikProps } from "formik";
import { PurchaseSchema } from "../schema";
import { Purchase } from "@/interfaces/purchase";
import { Coupons } from "@/interfaces/database_tables";
import { useEffect, useState } from "react";

export default function PurchaseForm({
    userID,
    eventID,
    normalPrice,
    VIPPrice,
    couponData,
    points,
}: {
    userID: number;
    eventID: number;
    normalPrice: number;
    VIPPrice: number | null;
    couponData: Array<Coupons>;
    points: number;
}) {
    const [total, setTotal] = useState<number>(0);
    const [finalTotal, setFinal] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [pointsUsed, setPoints] = useState<number>(0);

    useEffect(() => {
        if (finalTotal <= points) {
            setPoints(finalTotal);
        } else {
            setPoints(points);
        };
    }, [total, finalTotal, discount]);

    // const postPurchase = async () => {
    //     ;
    // };

    return (
        <div>
            <Formik
                initialValues={{
                    normals: 0,
                    VIPs: 0,
                    coupon: "",
                }}
                validationSchema={PurchaseSchema}
                onSubmit={(values) => {
                    console.log(values);
                    // postPurchase(values);
                }}>
                {(props: FormikProps<Purchase>) => {
                    const { values, errors, touched, handleChange } = props;

                    return (
                        <Form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="normals" className="text-sm" aria-label={`Regular price ${normalPrice}`}>
                                    Regular Rp {normalPrice.toLocaleString("id-ID")},00:
                                </label>
                                <Field type="number" name="normals" onChange={
                                    (e: React.ChangeEvent<any>) => {
                                        if (e.target.value > props.values.normals) {
                                            setTotal(total + normalPrice);
                                            setFinal(finalTotal + (normalPrice * (1 - (discount / 100))));
                                        } else {
                                            setTotal(total - normalPrice);
                                            setFinal(finalTotal - (normalPrice * (1 - (discount / 100))));
                                        };
                                        handleChange(e);
                                    }
                                } values={values.normals} aria-label="Regular tickets number box"
                                    className="border border-black rounded-md px-2" id="purchasenormals" />
                                {touched.normals && errors.normals ? (
                                    <div className="text-xs text-red-600">{errors.normals}</div>
                                ) : null}
                            </div>
                            {VIPPrice ?
                            <div className="flex flex-col gap-1">
                                <label htmlFor="VIPs" className="text-sm" aria-label={`VIP price ${VIPPrice}`}>VIP Rp {VIPPrice.toLocaleString("id-ID")},00:</label>
                                <Field type="number" name="VIPs" onChange={
                                    (e: React.ChangeEvent<any>) => {
                                        if (e.target.value > props.values.VIPs) {
                                            setTotal(total + VIPPrice)
                                            setFinal(finalTotal + (VIPPrice * (1 - (discount / 100))));
                                        } else {
                                            setTotal(total - VIPPrice);
                                            setFinal(finalTotal - (VIPPrice * (1 - (discount / 100))));
                                        };
                                        handleChange(e);
                                    }
                                } values={values.VIPs} aria-label="VIP tickets number box"
                                    className="border border-black rounded-md px-2" id="purchaseVIPs" />
                                {touched.VIPs && errors.VIPs ? (
                                    <div className="text-xs text-red-600">{errors.VIPs}</div>
                                ) : null}
                            </div> : null}
                            <div>
                                Total: Rp {total.toLocaleString("id-ID")},00
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="coupon" className="text-sm" aria-label="Coupon">Coupon </label>
                                <Field as="select" name="coupon" onChange={
                                    (e: React.ChangeEvent<any>) => {
                                        const couponDiscount: number = parseInt(e.target.value.split(":")[1]);
                                        if (couponDiscount) {
                                            setDiscount(couponDiscount);
                                            setFinal(total * (1 - (couponDiscount / 100)));
                                        } else {
                                            setFinal(total);
                                        };
                                        handleChange(e);
                                    }
                                } values={values.coupon} aria-label="Select a coupon to use"
                                    className="border border-black rounded-md px-2" id="purchasecoupons">
                                    <option key="0" value="">No coupon</option>
                                    {couponData.map((item) => (
                                        <option key={item.id} value={item.code + ":" + item.discount}>{item.organizerName === "admin" ? "Referral code" : item.organizerName} {item.discount}%</option>
                                    ))}
                                </Field>
                                {touched.coupon && errors.coupon ? (
                                    <div className="text-xs text-red-600">{errors.coupon}</div>
                                ) : null}
                            </div>
                            <div>
                                Points used: {pointsUsed}
                            </div>
                            <div>
                                Final total: Rp {(finalTotal - pointsUsed).toLocaleString("id-ID")},00
                            </div>
                            <button type="submit" className="rounded-md border border-black m-auto py-1 px-5 bg-sky-100 shadow-sm shadow-slate-300 mt-4" aria-label="Log in button">
                                Checkout
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};