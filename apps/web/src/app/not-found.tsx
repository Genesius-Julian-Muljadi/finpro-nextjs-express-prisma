"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
    })

    return (
        <div className="flex">
            <div className="m-auto">Page not found</div>
        </div>
    );
};