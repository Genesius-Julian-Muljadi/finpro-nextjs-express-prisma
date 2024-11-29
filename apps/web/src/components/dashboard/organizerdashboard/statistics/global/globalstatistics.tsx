"use client";

import { Events, Organizers } from "@/interfaces/database_tables";
import { useDispatch, useSelector } from "react-redux";
import { toggleGStats } from "@/redux/slices/toggleglobalstatistics";
// import GlobalRatings from "./ratings/ratings";
import GlobalTicketsSold from "./ticketssold/ticketssoldchart";
import GlobalRevenue from "./revenue/revenuechart";
import GlobalRatings from "./ratings/ratingschart";

export default function GlobalStatistics({ events, organizer }: { events: Array<Events>, organizer: Organizers }) {
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
        <div className="flex flex-col w-full" id="organizerdashboardstatisticsdiv">
            <button className="my-auto text-left h-12 px-4 rounded-md shadow-sm shadow-slate-600" onClick={OpenAllCharts}>
                Global Statistics
            </button>
            <div className="hidden grid-cols-1 grid-rows-3 sm:grid-cols-3 sm:grid-rows-1 gap-1 w-full p-4 *:mx-auto" id="globalchartsdiv">
                <GlobalTicketsSold events={events} year={new Date(organizer.dateCreated).getFullYear()} />
                <GlobalRevenue events={events} year={new Date(organizer.dateCreated).getFullYear()} />
                <GlobalRatings events={events} year={new Date(organizer.dateCreated).getFullYear()} />
            </div>
        </div>
    );
};