import axios from "axios";
import InvalidEvent from "../invalidevent";
import VerifyTokenServer from "@/functions/verifytokenserver";
import { AccessTokenUser } from "@/interfaces/accesstokens";
import { Coupons, Point_Balance, Events } from "@/interfaces/database_tables";
import PurchaseFormProvider from "./purchaseform/purchaseformprovider";

export default async function EventPurchasePageByIDView({ id }: { id: number }) {
    if (!id) {
        return <InvalidEvent />;
    };

    try {
        const API: string = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";

        const eventData = await axios.get(API + "/eventevent/" + id);
        const event: Events = eventData.data.data;

        const token = await VerifyTokenServer() as AccessTokenUser;
    
        const couponData = await axios.get(API + "/couponsuser/" + token.id);
        const coupons: Array<Coupons> =
        // Retrieve only coupons from this event's organizer, or from admin
            couponData.data.data.filter((item: Coupons) => item.organizerID === event.organizerID || item.organizerID === 5);
    
        const pointData = await axios.get(API + "/pointsuser/" + token.id);
        const pointHistory: Array<Point_Balance> = pointData.data.data;
        const activePoints: Array<Point_Balance> = pointHistory.filter((item) => {
            const now = new Date();
            const expiry = new Date(item.expiryDate);
            if (now.getFullYear() > expiry.getFullYear()) {
                return false;
            } else if (now.getFullYear() < expiry.getFullYear()) {
                return true;
            } else if (now.getMonth() > expiry.getMonth()) {
                return false;
            } else if (now.getMonth() < expiry.getMonth()) {
                return true;
            } else if (now.getDate() > expiry.getDate()) {
                return false;
            } else {
                return true;
            };
        });
        let activePointsTotal: number = 0;
        for (let i = 0; i < activePoints.length; i++) {
            activePointsTotal += activePoints[i].nominal;
        };
    
        return (
            <div className="mx-6">
                <div className="grid grid-cols-5 grid-rows-1">
                    <div className="col-start-4 col-end-6 row-start-1 row-end-2 flex flex-col gap-4">
                        <div>Purchase</div>
                        <div>
                            <PurchaseFormProvider
                            userID={token.id}
                            eventID={id}
                            normalPrice={event.normalPrice}
                            VIPPrice={event.VIPPrice}
                            couponData={coupons}
                            points={activePointsTotal} />
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (err) {
        console.log("something went wrong! event purchase page");
        console.log(err);
        return (
            <InvalidEvent />
        );
    };
};