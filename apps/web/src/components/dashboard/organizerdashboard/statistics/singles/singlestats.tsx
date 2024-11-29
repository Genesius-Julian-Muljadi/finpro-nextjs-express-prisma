import { Event_Ratings, Events, Transactions } from "@/interfaces/database_tables";
import axios from "axios";
import SingleNormalsSold from "./normalssold/normalssoldchart";
import SingleVIPsSold from "./VIPssold/VIPssoldchart";
import SingleRevenue from "./revenue/revenuechart";
import SingleRatings from "./ratings/ratingschart";
import { event } from "cypress/types/jquery";

export default async function DashboardSingleStats({ transactions, id }: { transactions: Array<Transactions>, id: number }) {
    const data = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/auth/eventevent/" + id);
    const eventData: Events = data.data.data;

    const data2 = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/auth/ratingsevent/" + id);
    const ratingsData: Array<Event_Ratings> = data2.data.data;

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-2 sm:gap-x-6 sm:gap-y-4 mx-6 sm:mx-10 *:mx-auto">
                    <div className="w-full">
                        <SingleNormalsSold transactions={transactions} date={new Date(eventData.eventDate)} />
                    </div>
                    <div className="w-full">
                        <SingleVIPsSold transactions={transactions} date={new Date(eventData.eventDate)} />
                    </div>
                    <div className="w-full">
                        <SingleRevenue transactions={transactions} date={new Date(eventData.eventDate)} />
                    </div>
                    <div className="w-full">
                        <SingleRatings ratings={ratingsData} transactions={eventData.normalsSold + eventData.VIPsSold} />
                    </div>
                </div>
                <div>
                    Ratings section, maybe
                </div>
            </div>
        </div>
    );
};