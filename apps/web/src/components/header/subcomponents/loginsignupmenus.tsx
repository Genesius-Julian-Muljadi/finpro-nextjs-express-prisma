"use client";

import VerifyTokenClient from "@/functions/verifytokenclient";
import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";
import { toggleMenu } from "@/redux/slices/togglemenu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";

export default function LoginSignup() {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
    const [sessionCookies, setSession, removeSession] = useCookies(['access_token_session']);
    let n = useSelector((state: {TMSlice: {menuOpen: number}}) => state.TMSlice.menuOpen);
    const dispatch = useDispatch();
    const router = useRouter();
    const decodedToken: AccessTokenUser | AccessTokenOrganizer | null = VerifyTokenClient();

    useEffect(() => {
        const loginMenu = document.getElementById("loginmenudiv") as HTMLDivElement;
        const signupMenu = document.getElementById("signupmenudiv") as HTMLDivElement;
        
        if (n === 1) {
            loginMenu.style.display = "grid";
            signupMenu.style.display = "none";
        } else if (n === 2) {
            loginMenu.style.display = "none";
            signupMenu.style.display = "grid";
        } else {
            loginMenu.style.display = "none";
            signupMenu.style.display = "none";
        };
    }, [n]);

    try {
        return (
            <div>
                {!decodedToken ? (
                    <div className="grid grid-cols-3 grid-rows-1">
                        <div className="col-start-2 col-end-3 row-start-1 row-end-2 bg-slate-600 py-2 rounded-md bg-opacity-0 hover:bg-opacity-15 active:bg-opacity-25">
                            <button onClick={() => dispatch(toggleMenu('login'))} aria-label="Log in button">
                                Log in
                            </button>
                        </div>
                        <div className="col-start-3 col-end-4 row-start-1 row-end-2 bg-slate-600 py-2 rounded-md bg-opacity-0 hover:bg-opacity-15 active:bg-opacity-25">
                            <button onClick={() => dispatch(toggleMenu('signup'))} aria-label="Sign up button">
                                Sign up
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 grid-rows-1">
                        <div className="col-start-1 col-end-3 row-start-1 row-end-2">
                            <Link href="/dashboard" aria-label="Dashboard button">
                                Dashboard
                            </Link>
                        </div>
                        <div className="col-start-3 col-end-4 row-start-1 row-end-2">
                            <button aria-label="Log out button"
                            onClick={() => {
                                router.push("/");
                                removeCookie("access_token", { path: "/" });
                                removeSession("access_token_session", { path: "/" });
                                document.cookie = `access_token=-; expires=1`;
                            }}>
                                Log out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (err) {
        console.log(err);
        return null;
    };
};