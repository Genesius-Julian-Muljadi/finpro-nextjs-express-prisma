"use client";

import "./style.css"

export default function LoginMenu() {
    ;

    return (
        <div className="fixed grid h-screen w-screen" id="loginmenu">
            <div className="my-auto mx-2 sm:mx-auto h-[480px] max-w-full sm:w-[640px] shadow-sm shadow-slate-700 bg-neutral-100 place-content-center" aria-label="Login Menu">
                <div className="mx-2 sm:mx-4 my-2 flex flex-col gap-2">
                    <div className="grid grid-cols-2 grid-rows-1 w-[80%] mx-auto *:m-auto border border-black">
                        <label className="cursor-pointer mt-[0.1rem] px-4 rounded-md hover:bg-zinc-200 active:bg-zinc-300" aria-label="Log in as a participant">
                            <input type="radio" className=" size-4 mr-2 align-middle mt-[-0.2rem]" name="loginradio" id="default" />
                            <span>Participant</span>
                        </label>
                        <label className="cursor-pointer mt-[0.1rem] px-4 rounded-md hover:bg-zinc-200 active:bg-zinc-300" aria-label="Log in as an organizer">
                            <input type="radio" className="size-4 mr-2 align-middle mt-[-0.2rem]" name="loginradio" id="default2" />
                            <span>Organizer</span>
                        </label>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};