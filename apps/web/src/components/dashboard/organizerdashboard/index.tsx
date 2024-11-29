import { AccessTokenOrganizer } from "@/interfaces/accesstokens";
import { Events } from "@/interfaces/database_tables";
import axios from "axios";
import DiscountTableData from "./discounttabledata";
import GlobalStatsProvider from "./statistics/global/globalstatsprovider";

export default async function OrganizerDashboard({ token }: { token: AccessTokenOrganizer }) {
    const data = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_URL +
        "/auth/eventorganizer/" +
        token.id
    );
    const eventData: Array<Events> = data.data.data;

    return (
        <div className="flex mx-2 sm:mx-6">
            <div className="flex flex-col gap-4 mx-auto">
                <div>
                    Pending Transactions
                </div>
                <div className="flex flex-col m-auto" id="organizerdashboardeventsdiv">
                    <div className="grid grid-cols-2 grid-rows-1 border border-black h-12 text-center">
                        <div className="col-start-1 col-end-2 row-start-1 row-end-2 my-auto" aria-label="Event history button: History will appear below">
                            Event history button
                        </div>
                        <div className="col-start-2 col-end-3 row-start-1 row-end-2 my-auto" aria-label="Create a new event">
                            <a href="/dashboard/createevent" className="px-4 py-2 w-full h-full border border-black">
                                Create new event
                            </a>
                        </div>
                    </div>
                    <div id="organizerdashboardeventstable" aria-label="Event history list">
                        <table className="border border-black border-collapse m-auto">
                            <thead>
                                <tr className="*:px-1 *:border *:border-gray-700 *:m-auto">
                                    <th>Title / Stats</th>
                                    <th>Date</th>
                                    <th>Genre</th>
                                    <th>
                                        <div>Tickets Sold</div>
                                        <div>Normal, VIP</div>
                                    </th>
                                    <th>
                                        <div>Prices</div>
                                        <div>Normal, VIP</div>
                                    </th>
                                    <th>Discounts</th>
                                    <th>Rating</th>
                                    <th>Date Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventData?.map((item) => (
                                    <tr key={item.id} className="*:px-1 *:text-center *:border *:border-black *:max-w-32">
                                        <td>
                                            <div>
                                                <a href={`${String(process.env.NEXT_PUBLIC_BASE_WEB_URL)}/events/${item.id}`}
                                                className="underline text-blue-600 hover:text-black">
                                                    {item.title}
                                                </a>
                                            </div>
                                            <div>
                                                <a href={`${String(process.env.NEXT_PUBLIC_BASE_WEB_URL)}/dashboard/events/${item.id}`}
                                                className="underline text-blue-600 hover:text-black">
                                                    Stats
                                                </a>
                                            </div>
                                        </td>
                                        <td>{new Date(item.eventDate).toLocaleDateString()}</td>
                                        <td>{item.genre}</td>
                                        <td>
                                            <div>{item.normalsSold}/{item.maxNormals} ,</div>
                                            <div>{item.VIPsSold}/{item.maxVIPs}</div>
                                        </td>
                                        <td>
                                            <div>{item.normalPrice} ,</div>
                                            <div>{item.VIPPrice}</div>
                                        </td>
                                        <td>
                                            <DiscountTableData event={item} />
                                        </td>
                                        <td>
                                            {new Date().valueOf() <= new Date(item.eventDate).valueOf() || !item.ratingAvg ?
                                            "-" :
                                            item.ratingAvg}
                                        </td>
                                        <td>{new Date(item.dateCreated).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="organizerdashboardcouponsdiv">
                    Coupons
                </div>
                <GlobalStatsProvider events={eventData} />
            </div>
        </div>
    );
};