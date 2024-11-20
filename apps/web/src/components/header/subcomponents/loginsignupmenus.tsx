"use client";

import VerifyTokenClient from "@/functions/verifytokenclient";
import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";
import { toggleMenu } from "@/redux/slices/togglemenu";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";


export default function LoginSignup() {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
    let n = useSelector((state: {TMSlice: {menuOpen: number}}) => state.TMSlice.menuOpen);
    const dispatch = useDispatch();
    const router = useRouter();
    const decodedToken: AccessTokenUser | AccessTokenOrganizer | null = VerifyTokenClient();

    useEffect(() => {
        console.log("state changed: " + n);
        const loginMenu = document.getElementById("loginmenudiv") as HTMLDivElement;
        const signupMenu = document.getElementById("signupmenudiv") as HTMLDivElement;
        
        if (n === 1) {
            console.log("doing useEffect for login");
            loginMenu.style.display = "grid";
            signupMenu.style.display = "none";
        } else if (n === 2) {
            console.log("doing useEffect for signup");
            loginMenu.style.display = "none";
            signupMenu.style.display = "grid";
        } else {
            console.log("doing useEffect for reset or page loaded");
            loginMenu.style.display = "none";
            signupMenu.style.display = "none";
        };
    }, [n]);

    return (
        <div>
            {!decodedToken ? (
                <div className="grid grid-cols-3 grid-rows-1">
                    <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                        <button onClick={() => dispatch(toggleMenu('login'))} aria-label="Log in button">
                            Log in
                        </button>
                    </div>
                    <div className="col-start-3 col-end-4 row-start-1 row-end-2">
                        <button onClick={() => dispatch(toggleMenu('signup'))} aria-label="Sign up button">
                            Sign up
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-3 grid-rows-1">
                    <div className="col-start-1 col-end-3 row-start-1 row-end-2">
                        <a href="/dashboard" aria-label="Dashboard button">
                            Dashboard
                        </a>
                    </div>
                    <div className="col-start-3 col-end-4 row-start-1 row-end-2">
                        <button aria-label="Log out button"
                        onClick={() => {
                            router.push("/");
                            removeCookie("access_token", { path: "/" });
                            sessionStorage.removeItem("access_token");
                            console.log("access tokens removed");
                        }}>
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};