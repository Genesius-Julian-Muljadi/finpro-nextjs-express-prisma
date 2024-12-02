"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InvalidEvent() {
    const router = useRouter();

    useEffect(() => {
        router.push("/events");
    })

    try {
        return (
            <div className="flex">
                <div className="m-auto">Invalid event ID</div>
            </div>
        );
    } catch (err) {
        console.log(err);
        return null;
    };
};