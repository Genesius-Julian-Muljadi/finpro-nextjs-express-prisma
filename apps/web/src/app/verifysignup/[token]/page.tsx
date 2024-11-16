"use client";

import { Transition } from "./functions";

export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
    const signupToken: string = (await params).token;

    return (
        <div className="grid grid-cols-1 grid-rows-1">
            <div className="col-start-1 col-end-2 row-start-1 row-end-2" id="verifypagebuttondiv">
                <button onClick={() => Transition(signupToken)} className="border border-black rounded-md">
                    <div className="my-1 mx-3">
                        Verify!
                    </div>
                </button>
            </div>
            <div className="col-start-1 col-end-2 row-start-1 row-end-2 hidden" id="verifypagemessagediv">
                Thank you for verifying! You can now login and access your dashboard.
            </div>
        </div>
    );
};