import Image from "next/image";
import "../../index.css";
import axios from "axios";
import { Events } from "@/interfaces/database_tables";
import imgs from "@/assets/images";

export default async function HomeView() {
    const genres: Array<string> = ["Classical", "Pop", "Jazz", "Rock", "Metal", "Other"];
    const imgarr = imgs;
    const eventsraw = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/auth/events");
    const eventData: Array<Events> = eventsraw.data.data;

    let randevents: Array<Events> = [];
    for (let i = 0; i < 8; i++) {
        randevents.push(eventData[Math.floor(Math.random()*eventData.length)]);
    };

    let randevents2: Array<Events> = [];
    const filtered: Array<Events> = eventData.filter((item) => {
        return new Date(item.eventDate).valueOf() >= new Date().valueOf();
    });
    for (let i = 0; i < 8; i++) {
        randevents2.push(filtered[Math.floor(Math.random()*filtered.length)]);
    };
    randevents2.sort((a, b) => {
        return new Date(b.eventDate).valueOf() - new Date(a.eventDate).valueOf()
    });

    return (
        <div>
            <div className="flex flex-col gap-6 mx-2 sm:mx-10">
                <div className="flex flex-col sm:grid sm:grid-cols-5 sm:mx-10 md:mx-20 mb-4 shadow-lg shadow-[#22253b]">
                    <div className="sm:col-start-1 sm:col-end-4">
                        <Image src={imgarr[Math.floor(Math.random()*imgarr.length)]} alt='stockimg' className="h-96 sm:h-full w-full" />
                    </div>
                    <div className="sm:col-start-4 sm:col-end-6 grid grid-rows-5 p-4 sm:p-8">
                        <div className="row-start-1 row-end-5 flex flex-col gap-2 sm:gap-4">
                            <div className="text-2xl font-bold text-left text-wrap">
                                {randevents2[0].title}
                            </div>
                            <div className="pb-2 border-b-2 border-neutral-400 text-wrap">
                                {randevents2[0].overview}
                            </div>
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <div className="grid grid-cols-3 mb-2">
                                    <div className="text-lg text-left font-semibold my-auto">
                                        {randevents2[0].genre}
                                    </div>
                                    <div className="col-span-2 text-base text-right text-neutral-500 my-auto text-nowrap">
                                        {new Date(randevents2[0].eventDate).toDateString()}
                                    </div>
                                </div>
                                <div className="text-base text-left">
                                    {randevents2[0].venue}
                                </div>
                                <div className={`text-base text-left text-nowrap`}>
                                    {randevents2[0].normalPrice
                                        ? (randevents2[0].VIPPrice ? "Regular: " : "") + `Rp ${randevents2[0].normalPrice.toLocaleString("id-ID")},00`
                                        : "Free"}
                                </div>
                                {randevents2[0].VIPPrice
                                    ? (
                                    <div className="text-base text-left">
                                        VIP: Rp {randevents2[0].VIPPrice.toLocaleString("id-ID")},00
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="row-start-5 row-end-6 border-t-2 border-neutral-800 pt-4 pb-2 sm:pt-2 sm:pb-0 flex">
                            <div className="m-auto">
                                <a href={`/events/${randevents2[0].id}`} className="py-2 px-20 bg-emerald-600 shadow-md shadow-emerald-900 border border-stone-950 rounded-lg text-white font-bold text-lg">
                                    Event Page
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="font-semibold text-lg text-left pl-2 pb-1 border-b border-neutral-300">
                        Genres
                    </div>
                    <div className={`grid grid-cols-3 sm:grid-cols-${genres.length} gap-4`}>
                        {genres.map((item) => (
                            <div className="text-base sm:text-lg font-semibold shadow-md shadow-slate-500 rounded-full size-20 sm:size-32 m-auto text-center grid bg-zinc-50">
                                <div className="m-auto">
                                    {item}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="font-semibold text-lg text-left pl-2 pb-1 border-b border-neutral-300">
                        Venues
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                            <div className="m-auto text-semibold border border-slate-700 rounded-full py-1 px-3 shadow-sm shadow-orange-200">
                                {randevents[item].venue}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="font-semibold text-lg text-left pl-2 pb-1 border-b border-neutral-300">
                        Upcoming
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                            <div className="flex flex-col gap-1">
                                <Image src={imgarr[Math.floor(Math.random()*imgarr.length)]} alt='stockimg' className="h-72 sm:h-52 w-[100%] rounded-sm" />
                                <div className="grid grid-cols-3 grid-rows-1 mx-2">
                                    <div className="font-semibold text-left col-span-2 text-wrap text-lg my-auto">
                                        {randevents2[item].title}
                                    </div>
                                    <div className="text-sm text-right mt-1">
                                        {new Date(randevents2[item].eventDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="mx-2 text-wrap text-sm">
                                    {randevents2[item].overview}
                                </div>
                                <div className="mx-2 grid grid-cols-2">
                                    <div className={`text-${randevents2[item].VIPPrice ? "xs" : "sm"} text-left text-nowrap`}>
                                        {randevents2[item].normalPrice
                                            ? (randevents2[item].VIPPrice ? "Regular: " : "") + `Rp ${randevents2[item].normalPrice.toLocaleString("id-ID")},00`
                                            : "Free"}
                                    </div>
                                    {randevents2[item].VIPPrice
                                        ? (
                                        <div className="text-xs text-left">
                                            VIP: Rp {randevents2[item].VIPPrice.toLocaleString("id-ID")},00
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="font-semibold text-lg text-left pl-2 pb-1 border-b border-neutral-300">
                        Explore concerts
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                            <div className="flex flex-col gap-1">
                                <Image src={imgarr[Math.floor(Math.random()*imgarr.length)]} alt='stockimg' className="h-72 sm:h-52 w-[100%] rounded-sm" />
                                <div className="grid grid-cols-3 grid-rows-1 mx-2">
                                    <div className="font-semibold text-left col-span-2 text-wrap text-lg my-auto">
                                        {randevents[item].title}
                                    </div>
                                    <div className="text-sm text-right mt-1">
                                        {new Date(randevents[item].eventDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="mx-2 text-wrap text-sm">
                                    {randevents[item].overview}
                                </div>
                                <div className="mx-2 grid grid-cols-2">
                                    <div className="text-sm text-left">
                                        {randevents[item].normalPrice
                                            ? (randevents2[item].VIPPrice ? "Regular: " : "") + `Rp ${randevents[item].normalPrice.toLocaleString("id-ID")},00`
                                            : "Free"}
                                    </div>
                                    {randevents[item].VIPPrice
                                        ? (
                                        <div className="text-sm text-left">
                                            VIP: Rp {randevents[item].VIPPrice.toLocaleString("id-ID")},00
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};