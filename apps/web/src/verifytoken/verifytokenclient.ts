import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

export default function VerifyTokenClient(): AccessTokenUser | AccessTokenOrganizer | null {
    // Token verification using react hook for client components
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const token = cookies.access_token;
    if (!token) {
        return null;
    } else if (token == "-") {
        removeCookie("access_token");
        return null;
    };

    const decodedToken: AccessTokenUser | AccessTokenOrganizer = jwtDecode(String(token));

    return decodedToken;
};