"use client";

import { Coupons } from "@/interfaces/database_tables";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import PurchaseForm from "./purchaseform";

export default function PurchaseFormProvider({
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
    return (
        <Provider store={store}>
            <PurchaseForm
            userID={userID}
            eventID={eventID}
            normalPrice={normalPrice}
            VIPPrice={VIPPrice}
            couponData={couponData}
            points={points}/>
        </Provider>
    );
};