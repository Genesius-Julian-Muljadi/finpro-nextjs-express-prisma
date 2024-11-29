"use client";

import { Events } from "@/interfaces/database_tables";
import GlobalTicketsSold from "./ticketssold/ticketssold";
import { useDispatch, useSelector } from "react-redux";
import { toggleGStats } from "@/redux/slices/toggleglobalstatistics";
import GlobalRevenue from "./revenue/revenue";
import GlobalRatings from "./ratings/ratings";

export default function GlobalStatistics({ events }: { events: Array<Events> }) {
    let n = useSelector((state: {TGSSlice: {menuOpen: boolean}}) => state.TGSSlice.menuOpen);
    const dispatch = useDispatch();

    const OpenAllCharts = () => {
        const charts = document.getElementById("globalchartsdiv") as HTMLDivElement;
        if (n) {
            charts.style.display = "none";
            dispatch(toggleGStats("close"));
        } else {
            charts.style.display = "grid";
            dispatch(toggleGStats("open"));
        };
    };

    return (
        <div className="border border-black flex flex-col w-full" id="organizerdashboardstatisticsdiv">
            <button className="my-auto text-left h-12 px-4" onClick={OpenAllCharts}>
                Global Statistics
            </button>
            <div className="hidden grid-cols-3 grid-rows-1 gap-1 w-full p-4 border border-green-700 *:mx-auto" id="globalchartsdiv">
                <GlobalTicketsSold events={events} />
                <GlobalRevenue events={events} />
                <GlobalRatings events={events} />
            </div>
        </div>
    );
};