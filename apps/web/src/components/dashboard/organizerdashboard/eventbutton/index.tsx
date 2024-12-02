"use client";

import { useEffect, useState } from "react";

export default function OrganizerDashboardEventButton() {
    const [men, setMenu] = useState<boolean>(false);

    useEffect(() => {
        const menu = document.getElementById("organizerdashboardeventstable") as HTMLDivElement;
        if (men) {
            menu.style.display = "inline";
        } else {
            menu.style.display = "none";
        };
    }, [men])

    const ToggleEvents = () => {
        if (men) {
            setMenu(false);
        } else {
            setMenu(true);
        };
    };
    return (
        <div className="cursor-pointer col-start-1 col-end-2 row-start-1 row-end-2 px-4 py-[0.35rem] my-auto rounded-md shadow-sm shadow-slate-500" aria-label="Event history button: History will appear below"
            onClick={ToggleEvents}>
            Event History
        </div>
    );
};