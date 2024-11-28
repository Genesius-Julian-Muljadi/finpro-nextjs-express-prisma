"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import GlobalStatistics from "./globalstatistics";
import { Events } from "@/interfaces/database_tables";

export default function GlobalStatsProvider({ events }: { events: Array<Events> }) {
    return (
        <Provider store={store}>
            <GlobalStatistics events={events} />
        </Provider>
    );
};