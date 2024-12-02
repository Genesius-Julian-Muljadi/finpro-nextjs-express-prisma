// import VerifyTokenClient from "@/functions/verifytokenclient";
import UserDashboard from "./userdashboard";
import OrganizerDashboard from "./organizerdashboard";
import { AccessTokenOrganizer, AccessTokenUser } from "@/interfaces/accesstokens";
import VerifyTokenServer from "@/functions/verifytokenserver";

export default async function DashboardView() {
    const token = await VerifyTokenServer();

    if (token?.role === "user") {
        return <UserDashboard token={token as AccessTokenUser} />
    } else if (token?.role === "organizer") {
        return <OrganizerDashboard token={token as AccessTokenOrganizer} />
    } else {
        return (
            <div className="h-screen w-screen grid grid-cols-1 grid-rows-1 place-content-center">
                <div className="text-lg text-center">
                    Something went wrong! Please log in again or contact an administrator!
                </div>
            </div>
        );
    };

};