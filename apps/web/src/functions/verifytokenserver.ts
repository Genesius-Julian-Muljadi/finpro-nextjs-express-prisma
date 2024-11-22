import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function VerifyTokenServer(): Promise<AccessTokenUser | AccessTokenOrganizer | null> {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("access_token")?.value

        let decodedToken: AccessTokenUser | AccessTokenOrganizer | null = null;
        if (token) {
            decodedToken =  jwtDecode(String(token));
        };
    
        return decodedToken;
        
    } catch (err) {
        console.log("something went wrong here");
        return null;
    };
};