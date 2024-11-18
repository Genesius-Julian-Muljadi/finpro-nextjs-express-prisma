"use client";

import { store } from "@/redux/store";
import LoginMenu from "./subcomponents/loginmenu";
import LoginSignup from "./subcomponents/loginsignupmenus";
import SignupMenu from "./subcomponents/signupmenu";
import { Provider } from "react-redux";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

export function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
  const router = useRouter();

  return (
    <Provider store={store}>
      <div className="grid grid-cols-1 grid-rows-1 mb-20 z-[49]">
        <div className="fixed h-9 w-screen px-4 sm:h-12 col-start-1 row-start-1 grid grid-cols-12 grid-rows-1 *:border *:border-black *:my-auto *:text-center">
          <div className="col-start-1 col-end-3 row-start-1 row-end-2" aria-label="Concert Hub Logo"
          onClick={() => {router.push("/")}}>
            ConcertHub logo
          </div>
          <div className="col-start-3 col-end-10 row-start-1 row-end-2">
            Search bar with filters
          </div>
          <div className="col-start-11 col-end-13 row-start-1 row-end-2" aria-label="Log in button">
            <LoginSignup />
          </div>
          <button className="col-start-10 col-end-11 row-start-1 row-end-2 size-4 border border-black" onClick={() => {console.log(cookies);}}>
            Check access_token cookie
          </button>
        </div>
        <div className="col-start-1 row-start-1 z-50">
          <LoginMenu />
        </div>
        <div className="col-start-1 row-start-1 z-50">
          <SignupMenu />
        </div>
      </div>
    </Provider>
  );
};
