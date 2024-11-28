import { AccessTokenUser } from "@/interfaces/accesstokens";
import { CouponHistoryClose, CouponHistoryOpen, PointHistoryClose, PointHistoryOpen } from "./buttons";
import axios from "axios";
import { Coupons, Events, History, Point_Balance, Transactions } from "@/interfaces/database_tables";

export default async function UserDashboard({ token }: { token: AccessTokenUser }) {
    const API: string = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";

    const couponData = await axios.get(API + "/couponsuser/" + token.id);
    const coupons: Array<Coupons> = couponData.data.data;

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

    const historyData = await axios.get(API + "/historyuser/" + token.id);
    const history: Array<History> = historyData.data.data;
    const transactionData: Array<Transactions> = [];
    for (let i = 0; i < history.length; i++) {
        const data = await axios.get(API + "/transactiontransaction/" + history[i].transactionID);
        transactionData.push(data.data.data);
    };
    const eventData: Array<Events> = [];
    for (let i = 0; i < transactionData.length; i++) {
        const data = await axios.get(API + "/eventevent/" + transactionData[i].eventID);
        eventData.push(data.data.data);
    };

    return (
        <div className="px-6">
            <div className="flex flex-col gap-2">
                <div className="col-start-3 col-end-4 row-start-1 row-end-2 text-right">
                    Referral code: {token.refCode}
                </div>
                <div className="grid grid-cols-2 grid-rows-1">
                    <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col gap-0 *:text-center">
                        <div className="border border-black">
                            Point balance: {activePointsTotal.toLocaleString("id-ID")}
                        </div>
                        <div className="grid grid-cols-1 grid-rows-1">
                            <div className="col-start-1 col-end-2 row-start-1 row-end-2" aria-label="Point balance history button" id="pointhistorybuttondiv">
                                <PointHistoryOpen />
                            </div>
                            <div className="col-start-1 col-end-2 row-start-1 row-end-2 hidden" aria-label="Point balance history page" id="pointhistorytablediv">
                                <div className="flex flex-col gap-0">
                                    <table className="border border-black">
                                        <thead>
                                            <tr>
                                                <th>Nomimal</th>
                                                <th>Expiry</th>
                                                <th>Received on</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pointHistory?.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.nominal.toLocaleString("id-ID")}</td>
                                                    <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-"}</td>
                                                    <td>{new Date(item.dateCreated).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <PointHistoryClose />
                            </div>
                        </div>
                    </div>
                    <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex flex-col gap-0 *:text-center">
                        <div className="border border-black">
                            Coupons: {coupons.length}
                        </div>
                        <div className="grid grid-cols-1 grid-rows-1">
                            <div className="col-start-1 col-end-2 row-start-1 row-end-2" aria-label="Point balance history button" id="couponhistorybuttondiv">
                                <CouponHistoryOpen />
                            </div>
                            <div className="col-start-1 col-end-2 row-start-1 row-end-2 hidden" aria-label="Point balance history page" id="couponhistorytablediv">
                                <div className="flex flex-col gap-0">
                                    <table className="border border-black">
                                        <thead>
                                            <tr>
                                                <th>Discount</th>
                                                <th>Expiry</th>
                                                <th>Received from</th>
                                                <th>Received on</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {coupons?.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.discount}%</td>
                                                    <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-"}</td>
                                                    <td>{item.organizerName === "admin" ? "Referral code" : item.organizerName}</td>
                                                    <td>{new Date(item.dateCreated).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <CouponHistoryClose />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col text-center">
                    <div>
                        Transaction history
                    </div>
                    <table className="border border-black">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Regular / VIP</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history?.map((item) => (
                                <tr key={item.id}>
                                    <td>{eventData.shift()?.title}</td>
                                    <td>{transactionData[0].ticketCount} / {transactionData[0].VIPs}</td>
                                    <td>{transactionData.shift()?.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};