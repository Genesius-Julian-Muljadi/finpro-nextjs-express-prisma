"use client";

import { Transition } from "./functions";

export default function VerifyButton({ params }: { params: string }) {
    return (
        <button onClick={() => Transition(params)} className="border border-black rounded-md">
            <div className="my-1 mx-3">
                Verify!
            </div>
        </button>

    );
};