"use client";

import { AccessToken } from "@/interfaces/accesstoken";
import { toggleMenu } from "@/redux/slices/togglemenu";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";


export default function LoginSignup() {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
    // const [menu, setMenu] = useState<boolean>(false);
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
            console.log("doing useEffect for reset or page loaded");
            loginMenu.style.display = "none";
            signupMenu.style.display = "none";
        };
    }, [n]);

    // Access token verification
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
    
    // let userName: string = "jwt Error";
    // if (decodedToken && decodedToken.name) {
    //     userName = decodedToken.name;
    // };

    // // Toggle account menu
    // useEffect(() => {
    //     console.log("state changed: " + menu);
    //     if (!decodedToken) {
    //         return;
    //     };
        
    //     const accountMenu = document.getElementById("accountmenudiv") as HTMLDivElement;

    //     if (menu === true) {
    //         accountMenu.style.display = "grid";
    //     } else {
    //         accountMenu.style.display = "none";
    //     };
    // }, [menu]);

    // // Point balance tally for participants
    // let accountMenuOpenedUser: boolean = false;
    // let points: number | Promise<any> = 0;
    // points = useMemo(() => {
    //     const askForTally = async () => {
    //         try {
    //             const API: string = apiURL + "/auth";
    //             const { data } = await axios.get(API + "/points/" + decodedToken!.id);
    //             console.log(data);
    //             return 1;
    //         } catch (err) {
    //             console.log(err);
    //             return "something went wrong";
    //         };
    //     };
    //     return askForTally();
    // }, [accountMenuOpenedUser]);

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
                        <a href="/dashboard">
                            Dashboard
                        </a>
                    </div>
                    {/* <div className="col-start-1 col-end-3 row-start-1 row-end-2">
                        <button className="hover:bg-neutral-600 hover:bg-opacity-20 active:bg-opacity-40" aria-label="Account menu button"
                        onClick={() => {
                            if (menu === true) {
                                setMenu(false);
                            } else {
                                setMenu(true);
                            };
                        }}>
                            Hello, {userName}!
                        </button>
                    </div>
                    <div className="col-start-1 col-end-3 row-start-1 row-end-2" id="accountmenudiv">
                        <div className="flex flex-col gap-1">
                            <div>Dashboard link</div>
                        </div>
                    </div> */}
                    <div className="col-start-3 col-end-4 row-start-1 row-end-2">
                        <button onClick={() => {removeCookie("access_token", { path: "/" }); sessionStorage.removeItem("access_token"); console.log("access tokens removed");}} aria-label="Log out button">
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};