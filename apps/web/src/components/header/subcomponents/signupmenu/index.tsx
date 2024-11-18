"use client";

import SignupMenuUser from "./signupmenuuser";
import { useEffect, useState } from "react";
import SignupMenuOrganizer from "./signupmenuorganizer";
import { useDispatch } from "react-redux";
import { toggleMenu } from "@/redux/slices/togglemenu";

export default function SignupMenu() {
    const [role, setRole] = useState<number>(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const menu1 = document.getElementById("signupmenuuserdiv") as HTMLDivElement;
        const menu2 = document.getElementById("signupmenuorganizerdiv") as HTMLDivElement;
        const button1 = document.getElementById("roleselectparticipantlabelsignup") as HTMLSpanElement;
        const button2 = document.getElementById("roleselectorganizerlabelsignup") as HTMLSpanElement;
        
        if (role == 1) {
            console.log("signup menu changed to participant");
            button1.style.backgroundColor = "rgb(185, 228, 248)";
            button2.style.backgroundColor = "transparent";
            menu1.style.zIndex = "1";
            menu2.style.zIndex = "-1";
            menu1.style.display = "block";
            menu2.style.display = "none";
        } else if (role == 2) {
            console.log("signup menu changed to organizer");
            button1.style.backgroundColor = "transparent";
            button2.style.backgroundColor = "rgb(185, 228, 248)";
            menu1.style.zIndex = "-1";
            menu2.style.zIndex = "1";
            menu1.style.display = "none";
            menu2.style.display = "block";
        } else {
            console.log("page loaded");
            button1.style.backgroundColor = "transparent";
            button2.style.backgroundColor = "transparent";
            menu1.style.zIndex = "-1";
            menu2.style.zIndex = "-1";
        };
    });

    return (
        <div className="fixed hidden h-screen w-screen bg-slate-600 bg-opacity-25 grid-cols-1 grid-rows-1" id="signupmenudiv">
            <div className="col-start-1 col-end-2 row-start-1 row-end-2" onClick={() => dispatch(toggleMenu('reset'))}></div>
            <div className="col-start-1 col-end-2 row-start-1 row-end-2 my-auto mx-2 sm:mx-auto h-[560px] max-w-full sm:w-[640px] shadow-sm shadow-slate-700 bg-neutral-100" aria-label="Sign Up Menu">
                <div className="mx-2 sm:mx-8 mt-7 mb-2 flex flex-col gap-6">
                    <div className="grid grid-cols-2 grid-rows-1">
                        <label className="cursor-pointer mt-[0.1rem] rounded-md py-[0.4rem] grid m-auto hover:bg-zinc-200 active:bg-zinc-300" aria-label="Sign up as participant button">
                            <div className="mx-auto">
                                <input type="radio" name="signupradio" className="hidden" onClick={() => {setRole(() => 1); }} />
                                <span className="border border-black rounded-md px-2 sm:px-6 py-2 text-base sm:text-lg" id="roleselectparticipantlabelsignup">Sign up as Participant</span>
                            </div>
                        </label>
                        <label className="cursor-pointer mt-[0.1rem] rounded-md py-[0.4rem] grid m-auto hover:bg-zinc-200 active:bg-zinc-300" aria-label="Sign up as organizer button">
                            <div className="mx-auto">
                                <input type="radio" name="signupradio" className="hidden" onClick={() => {setRole(() => 2); }} />
                                <span className="border border-black rounded-md px-2 sm:px-6 py-2 text-base sm:text-lg" id="roleselectorganizerlabelsignup"> Sign up as Organizer</span>
                            </div>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 grid-rows-1">
                        <div className="col-start-1 col-end-2 row-start-1 row-end-2 z-[-1]" id="signupmenuuserdiv">
                            <SignupMenuUser />
                        </div>
                        <div className="col-start-1 col-end-2 row-start-1 row-end-2 z-[-1]" id="signupmenuorganizerdiv">
                            <SignupMenuOrganizer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};