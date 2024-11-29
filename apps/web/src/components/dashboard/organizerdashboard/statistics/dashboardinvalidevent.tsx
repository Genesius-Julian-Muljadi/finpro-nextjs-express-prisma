"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InvalidDashboardEvents() {
    const router = useRouter();

    useEffect(() => {
        router.push("/dashboard");
    });

    return (
        <div className="flex">
            <div className="m-auto">
                Event page requires eventID, or wrong eventID!
            </div>
        </div>
    );
};