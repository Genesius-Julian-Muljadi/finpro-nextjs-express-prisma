import names from "../lists/names";
import domains from "../lists/emaildomains";
import axios from "axios";
import { Coupons, Events, Point_Balance, Users } from "@/interfaces/database_tables";

export async function AddTransactions(n?: number) {
    const userraw = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/data/users");
    const users: Array<Users> = userraw.data.data;

    for (let i = 0; i < (n ? n : 1); i++) {
        const user: Users = users[Math.floor(Math.random() * users.length)];

        const eventraw = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/data/events");
        const eventsr: Array<Events> = eventraw.data.data;
        const events: Array<Events> = eventsr.filter((item) => {
            return new Date(item.eventDate).valueOf() > new Date(user.dateCreated).valueOf() &&
                !item.maxNormals ? true :
                (item.maxNormals! - item.normalsSold) + (item.maxVIPs - item.VIPsSold) > 0;
        });
        const event: Events = events[Math.floor(Math.random() * events.length)];

        const userID: number = user.id;
        const eventID: number = event.id;
        const tickets: number = event.maxNormals ? Math.ceil(Math.random() * Math.sqrt(event.maxNormals)) : Math.ceil(Math.random() * 5);
        const ticketCount: number = !event.maxNormals ?
            tickets :
            tickets <= ((event.maxNormals - event.normalsSold) + (event.maxVIPs - event.VIPsSold)) ?
                tickets :
                ((event.maxNormals - event.normalsSold) + (event.maxVIPs - event.VIPsSold));
        const VIPs: number = Math.floor(Math.random() *
            (((event.maxVIPs - event.VIPsSold) + 1) > ticketCount ? ticketCount : ((event.maxVIPs - event.VIPsSold) + 1)));
        const normalPrice: number = event.normalPrice;
        const VIPPrice: number = event.VIPPrice ? event.VIPPrice : 0;
        const coupons: Array<Coupons> = user.coupons.filter((item) => {
            return (item.organizerID === event.organizerID || item.organizerName === 'admin') &&
                item.active;
        });
        const coupon: Coupons = coupons[Math.floor(Math.random() * coupons.length)];
        const discount: number = coupon ? coupon.discount : 0;
        const couponCode: string = coupon ? coupon.code : "";
        const firstTotal: number = (((ticketCount - VIPs) * normalPrice) + (VIPs * VIPPrice)) * (1 - (discount / 100));
        const points: Array<Point_Balance> = user.codeUsed;
        let pointDiscount: number = 0;
        for (let k in points) {
            pointDiscount += points[k].nominal;
        };
        pointDiscount = firstTotal < pointDiscount ?
            firstTotal :
            pointDiscount;
        const start: Date = new Date(new Date(user.dateCreated).valueOf() < new Date(event.dateCreated).valueOf() ?
            new Date(event.dateCreated).valueOf() :
            new Date(user.dateCreated).valueOf());
        const creationDate: Date = new Date(start.valueOf() +
            Math.ceil(Math.random() * ((new Date().valueOf() < new Date(event.eventDate).valueOf() ? new Date().valueOf() : new Date(event.eventDate).valueOf()) - start.valueOf())));

        try {
            const user = await axios.post(process.env.NEXT_PUBLIC_BASE_API_URL + "/data/transactions/" + userID, {
                eventID: eventID,
                ticketCount: ticketCount,
                VIPs: VIPs,
                normalPrice: normalPrice,
                VIPPrice: VIPPrice,
                discount: discount,
                couponCode: couponCode,
                pointDiscount: pointDiscount,
                total: firstTotal - pointDiscount,
                dateCreated: creationDate,
            });
            console.log("Added transaction " + (i + 1));
        } catch (err) {
            console.log(err);
        };
    };
};