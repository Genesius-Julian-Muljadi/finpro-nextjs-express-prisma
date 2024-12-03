import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";
import { verify } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

export default function VerifyTokenClient(): AccessTokenUser | AccessTokenOrganizer | null {
    // Token verification using react hook for client components
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    let decodedToken: AccessTokenUser | AccessTokenOrganizer | null = null;
    const token = cookies.access_token;
    if (!token) {
        return null;
    };
    if (verify(token, String(process.env.NEXT_PUBLIC_SECRET_KEY))) {
        decodedToken = jwtDecode(String(token));
    } else {
        throw new Error("Unauthorized token!");
    };

    return decodedToken;
};