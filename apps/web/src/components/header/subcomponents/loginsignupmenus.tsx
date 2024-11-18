"use client";

import { AccessToken } from "@/interfaces/accesstoken";
import { toggleMenu } from "@/redux/slices/togglemenu";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";


export default function LoginSignup() {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
    let n = useSelector((state: {TMSlice: {menuOpen: number}}) => state.TMSlice.menuOpen);
    const dispatch = useDispatch();

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
            console.log("doing useEffect for reset");
            loginMenu.style.display = "none";
            signupMenu.style.display = "none";
        };
    });

    let sessionToken = sessionStorage.getItem("access_token");
    let decodedToken: AccessToken | null = null;
    console.log("sessionToken: " + sessionToken);
    if (!sessionToken) {
        console.log("access token not found in session storage");
        if (cookies.access_token) {
            sessionStorage.setItem("access_token", cookies.access_token);
            sessionToken = sessionStorage.getItem("access_token");
            console.log("account token found in cookies: " + sessionToken);
            decodedToken =  jwtDecode(String(sessionToken));
        } else {
            console.log("access token not found in cookies");
        };
    } else {
        console.log("access token found in session storage: " + sessionToken);
        decodedToken =  jwtDecode(String(sessionToken));
    };
    let userName: string = "jwt Error";
    if (decodedToken && decodedToken.name) {
        userName = decodedToken.name;
    };

    return (
        <div>
            {!sessionToken ? (
                <div className="grid grid-cols-2 grid-rows-1">
                    <div className="col-start-1 col-end-2 row-start-1 row-end-2">
                        <button onClick={() => dispatch(toggleMenu('login'))} aria-label="Log in button">
                            Log in
                        </button>
                    </div>
                    <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                        <button onClick={() => dispatch(toggleMenu('signup'))} aria-label="Sign up button">
                            Sign up
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 grid-rows-1">
                    <div className="col-start-1 col-end-2 row-start-1 row-end-2">
                        <label aria-label={`Hello, ${userName}`}>
                            Hello, {userName}!
                        </label>
                    </div>
                    <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                        <button onClick={() => {removeCookie("access_token", { path: "/" }); sessionStorage.removeItem("access_token"); console.log("access tokens removed");}} aria-label="Log out button">
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};