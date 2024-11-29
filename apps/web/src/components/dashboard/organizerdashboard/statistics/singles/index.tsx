import axios from "axios";
import InvalidDashboardEvents from "../dashboardinvalidevent";
import { Events, Transactions } from "@/interfaces/database_tables";
// import DashboardSingleStatsProvider from "./singlestatsprovider";
import DashboardSingleStats from "./singlestats";

export default async function DashboardEventPageByIDView({ id }: { id: number }) {
    if (!id) {
        return <InvalidDashboardEvents />;
    };

    const data = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/auth/transactionevent/" + id);
    const transactionData: Array<Transactions> = data.data.data;

    return (
        <div className="flex">
            <div className="flex flex-col gap-6 w-full *:mx-auto">
                <div>
                    Event image
                </div>
                <div>
                    Event title & leads (overview)
                </div>
                <DashboardSingleStats transactions={transactionData} id={id} />
            </div>
        </div>
    );
};