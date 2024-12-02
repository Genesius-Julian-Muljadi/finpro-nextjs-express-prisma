"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import GlobalStatistics from "./globalstatistics";
import { Event_Ratings, Events, Organizers } from "@/interfaces/database_tables";

export default function GlobalStatsProvider({ events, organizer, ratings }: { events: Array<Events>, organizer: Organizers, ratings: Array<Event_Ratings> }) {
    return (
        <Provider store={store}>
            <GlobalStatistics events={events} organizer={organizer} ratings={ratings} />
        </Provider>
    );
};