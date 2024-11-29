"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import GlobalStatistics from "./globalstatistics";
import { Events, Organizers } from "@/interfaces/database_tables";

export default function GlobalStatsProvider({ events, organizer }: { events: Array<Events>, organizer: Organizers }) {
    return (
        <Provider store={store}>
            <GlobalStatistics events={events} organizer={organizer} />
        </Provider>
    );
};