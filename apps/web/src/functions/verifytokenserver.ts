import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";
import { verify } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function VerifyTokenServer(): Promise<AccessTokenUser | AccessTokenOrganizer | null> {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("access_token")?.value

        let decodedToken: AccessTokenUser | AccessTokenOrganizer | null = null;
        if (token) {
            decodedToken =  jwtDecode(String(token));
            const verified = verify(token, String(process.env.NEXT_PUBLIC_SECRET_KEY));
            console.log(verified);
            if (!verified) {
                throw new Error("Unauthorized token!");
            };
        };
    
        return decodedToken;
        
    } catch (err) {
        console.log("something went wrong here");
        return null;
    };
};