import axios from "axios";
import InvalidEvent from "../invalidevent";
import VerifyTokenServer from "@/verifytoken/verifytokenserver";
import { AccessTokenUser } from "@/interfaces/accesstokens";
import { Coupons, Point_Balance, Events } from "@/interfaces/database_tables";
import PurchaseFormProvider from "./purchaseform/purchaseformprovider";
import imgs from "@/assets/images";
import Image from "next/image";

export default async function EventPurchasePageByIDView({ id }: { id: number }) {
    if (!id) {
        return <InvalidEvent />;
    };
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

    const imgarr = imgs;

    try {
        return (
            <div className="mx-6">
                <div className="flex flex-col sm:grid sm:grid-cols-5 sm:grid-rows-1 gap-10">
                    <div className="col-start-1 col-end-4 row-start-1 row-end-2">
                        <div className="flex flex-col mb-4 shadow-lg shadow-[#22253b]">
                            <div className="">
                                <Image src={imgarr[Math.floor(Math.random()*imgarr.length)]} alt='stockimg' className="h-96 sm:h-full w-full" />
                            </div>
                            <div className="grid grid-rows-5 p-4">
                                <div className="row-start-1 row-end-5 flex flex-col gap-2 sm:gap-4">
                                    <div className="text-2xl font-bold text-left text-wrap">
                                        {event.title}
                                    </div>
                                    <div className="pb-2 border-b-2 border-neutral-400 text-wrap">
                                        {event.overview}
                                    </div>
                                    <div className="flex flex-col gap-1 sm:gap-2">
                                        <div className="grid grid-cols-3 mb-2">
                                            <div className="text-lg text-left font-semibold my-auto">
                                                {event.genre}
                                            </div>
                                            <div className="col-span-2 text-base text-right text-neutral-500 my-auto text-nowrap">
                                                {new Date(event.eventDate).toDateString()}
                                            </div>
                                        </div>
                                        <div className="text-base text-left">
                                            {event.venue}
                                        </div>
                                        <div className={`text-base text-left text-nowrap`}>
                                            {event.normalPrice
                                                ? (event.VIPPrice ? "Regular: " : "") + `Rp ${event.normalPrice.toLocaleString("id-ID")},00`
                                                : "Free"}
                                        </div>
                                        {event.VIPPrice
                                            ? (
                                            <div className="text-base text-left">
                                                VIP: Rp {event.VIPPrice.toLocaleString("id-ID")},00
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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