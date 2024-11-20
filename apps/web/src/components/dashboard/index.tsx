"use client";

import VerifyTokenClient from "@/functions/verifytokenclient";
import UserDashboard from "./userdashboard";
import OrganizerDashboard from "./organizerdashboard";
import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";

export default function DashboardView() {
    const token: AccessTokenUser | AccessTokenOrganizer | null = VerifyTokenClient();
    console.log(token);

    if (token?.role === "user") {
        return <UserDashboard token={token as AccessTokenUser} />
    } else if (token?.role === "organizer") {
        return <OrganizerDashboard token={token as AccessTokenOrganizer} />
    } else {
        return (
            <div>
                Something went wrong!
            </div>
        );
    };

};