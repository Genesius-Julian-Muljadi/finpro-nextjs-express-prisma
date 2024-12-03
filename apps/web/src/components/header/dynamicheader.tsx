"use client";

import LoginMenu from "./subcomponents/loginmenu";
import LoginSignup from "./subcomponents/loginsignupmenus";
import SignupMenu from "./subcomponents/signupmenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

export default function DynamicHeader() {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
    const router = useRouter();

    try {
        return (
            <div className="grid grid-cols-1 grid-rows-1 mb-20 z-[49]">
              <div className="fixed h-9 w-screen sm:pr-6 sm:h-12 col-start-1 row-start-1 bg-[#81b1f8] shadow-md shadow-[#302e45] grid grid-cols-5 sm:grid-cols-12 grid-rows-1 *:my-auto *:text-center">
                <div className="col-start-1 col-end-2 sm:col-end-3 row-start-1 row-end-2 cursor-pointer flex h-full px-4 sm:px-10 mx-auto place-content-center bg-slate-600 bg-opacity-0 hover:bg-opacity-15 active:bg-opacity-25" aria-label="Concert Hub Logo"
                onClick={() => {router.push("/")}}>
                  <div className="m-auto hidden sm:flex flex-row gap-2">
                    <FontAwesomeIcon icon={faMusic} />
                    <FontAwesomeIcon icon={faMusic} />
                    <FontAwesomeIcon icon={faMusic} />
                  </div>
                  <div className="m-auto flex sm:hidden flex-row gap-2">
                    <FontAwesomeIcon icon={faMusic} />
                    <FontAwesomeIcon icon={faMusic} />
                  </div>
                </div>
                <div className="hidden sm:flex sm:col-start-3 sm:col-end-10 row-start-1 row-end-2">
                  Search bar with filters
                </div>
                <div className="col-start-3 col-end-6 sm:col-start-10 sm:col-end-13 row-start-1 row-end-2">
                  <LoginSignup />
                </div>
              </div>
              <div className="col-start-1 row-start-1 z-50">
                <LoginMenu />
              </div>
              <div className="col-start-1 row-start-1 z-50">
                <SignupMenu />
              </div>
            </div>
    
        );
    } catch (err) {
        console.log(err);
        return null;
    };
};