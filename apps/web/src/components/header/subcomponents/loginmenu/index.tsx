"use client";

import "./style.css"
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "@/redux/slices/togglemenu";
import { useEffect } from "react";
import LoginForm from "./loginform";
import { selectLoginRole } from "@/redux/slices/loginroleselect";

export default function LoginMenu() {
    let n = useSelector((state: {LRSSlice: {actionSelected: number}}) => state.LRSSlice.actionSelected);
    const dispatch = useDispatch();

    useEffect(() => {
        const menu = document.getElementById("loginformdiv") as HTMLDivElement;
        const button1 = document.getElementById("roleselectparticipantlabellogin") as HTMLSpanElement;
        const button2 = document.getElementById("roleselectorganizerlabellogin") as HTMLSpanElement;
        
        if (n === 1) {
            console.log("login menu changed to participant");
            button1.style.backgroundColor = "rgb(185, 228, 248)";
            button2.style.backgroundColor = "transparent";
            menu.style.zIndex = "1";
        } else if (n === 2) {
            console.log("login menu changed to organizer");
            button1.style.backgroundColor = "transparent";
            button2.style.backgroundColor = "rgb(185, 228, 248)";
            menu.style.zIndex = "1";
        } else {
            console.log("page loaded");
            button1.style.backgroundColor = "transparent";
            button2.style.backgroundColor = "transparent";
            menu.style.zIndex = "-1";
        };
    });

    return (
        <div className="fixed hidden h-screen w-screen bg-slate-600 bg-opacity-25 grid-rows-1 grid-cols-1" id="loginmenudiv">
            <div className="col-start-1 col-end-2 row-start-1 row-end-2" onClick={() => dispatch(toggleMenu('reset'))}></div>
            <div className="col-start-1 col-end-2 row-start-1 row-end-2 my-auto mx-2 sm:mx-auto h-[480px] max-w-full sm:w-[640px] shadow-sm shadow-slate-700 bg-neutral-100 place-content-center" aria-label="Login Menu">
                <div className="mx-2 sm:mx-4 my-2 flex flex-col gap-2">
                    <div className="grid grid-cols-2 grid-rows-1">
                        <label className="cursor-pointer mt-[0.1rem] rounded-md py-[0.4rem] grid m-auto hover:bg-zinc-200 active:bg-zinc-300" aria-label="Log in as participant">
                            <div className="mx-auto">
                                <input type="radio" name="signupradio" className="hidden" onClick={() => {dispatch(selectLoginRole('user')) }} />
                                <span className="border border-black rounded-md px-2 sm:px-6 py-2 text-base sm:text-lg" id="roleselectparticipantlabellogin">Log in as Participant</span>
                            </div>
                        </label>
                        <label className="cursor-pointer mt-[0.1rem] rounded-md py-[0.4rem] grid m-auto hover:bg-zinc-200 active:bg-zinc-300" aria-label="Log in as organizer">
                            <div className="mx-auto">
                                <input type="radio" name="signupradio" className="hidden" onClick={() => {dispatch(selectLoginRole('organizer')) }} />
                                <span className="border border-black rounded-md px-2 sm:px-6 py-2 text-base sm:text-lg" id="roleselectorganizerlabellogin">Log in as Organizer</span>
                            </div>
                        </label>
                    </div>
                    <div className="z-[-1]" id="loginformdiv">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};