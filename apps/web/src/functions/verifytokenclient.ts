import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

export default function VerifyTokenClient(): AccessTokenUser | AccessTokenOrganizer | null {
    // Token verification using react hook for client components
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    let sessionToken = sessionStorage.getItem("access_token");
    let decodedToken: AccessTokenUser | AccessTokenOrganizer | null = null;
    console.log("sessionToken: " + sessionToken);
    if (!sessionToken) {
        console.log("access token not found in session storage");
        if (cookies.access_token) {
            // Save token in sessionStorage so user isn't automatically logged out when token expires while site is still open
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

    return decodedToken;
};