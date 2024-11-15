"use client";

import "./style.css";
import SignupMenuUser from "./signupmenuuser";
import { useEffect, useState } from "react";
import SignupMenuOrganizer from "./signupmenuorganizer";

export default function SignupMenu() {
    const [role, setRole] = useState<number>(0);

    useEffect(() => {
        const menu1 = document.getElementById("signupmenuuser") as HTMLDivElement;
        const menu2 = document.getElementById("signupmenuorganizer") as HTMLDivElement;
        
        if (role == 1) {
            console.log("signup menu changed to participant");
        } else if (role == 2) {
            console.log("signup menu changed to organizer");
        } else {
            console.log("page loaded");
        };
    });

    return (
        <div className="fixed grid h-screen w-screen" id="signupmenu">
            <div className="my-auto mx-2 sm:mx-auto h-[540px] max-w-full sm:w-[640px] shadow-sm shadow-slate-700 bg-neutral-100 place-content-center" aria-label="Sign Up Menu">
                <div className="mx-2 sm:mx-8 my-2 flex flex-col gap-6">
                    <div className="grid grid-cols-2 grid-rows-1 *:m-auto *:border *:border-black *:px-5">
                        <label className="cursor-pointer mt-[0.1rem] px-4 rounded-md hover:bg-zinc-200 active:bg-zinc-300">
                            <input type="radio" name="signupradio" className="hidden" onClick={() => {setRole(() => 1); }} />
                            <span>Participant</span>
                        </label>
                        <label className="cursor-pointer mt-[0.1rem] px-4 rounded-md hover:bg-zinc-200 active:bg-zinc-300">
                            <input type="radio" name="signupradio" className="hidden" onClick={() => {setRole(() => 2); }} />
                            <span>Organizer</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 grid-rows-1">
                        <div className="col-start-1 col-end-2 row-start-1 row-end-2 z-[-1]">
                            <SignupMenuUser />
                        </div>
                        <div className="col-start-1 col-end-2 row-start-1 row-end-2 z-[1]">
                            <SignupMenuOrganizer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};