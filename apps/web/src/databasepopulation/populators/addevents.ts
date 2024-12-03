import { Organizers } from "@/interfaces/database_tables";
import strings from "../lists/randomstrings";
import words from "../lists/words";
import genres from "../lists/genres";
import axios from "axios";
import names from "../lists/names";
import discountTypes from "../lists/discounttypes";

export async function AddEvents(n?: number) {
    const organizerraw = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/data/organizers");
    const organizers: Array<Organizers> = organizerraw.data.data;

    // Code from Module 1, Set 03, Q6
    let istrt: string = "";
    let istrb: boolean = true;
    for (let i=0;i<words.length;i++) {
        if (istrb) {
            istrt = istrt + words[i].toUpperCase();
            istrb = false;
        } else {
            istrt = istrt + words[i];
        }
        if (/\s/.test(words[i])) {
            istrb = true;
        } else continue;
    };

    for (let i = 0; i < (n ? n : 1); i++) {
        const strarray: Array<string> = strings.split("\n");
        const wordarray: Array<string> = istrt.split("\n");
        const wordarray2: Array<string> = words.split("\n");
        const organizer: Organizers = organizers[Math.ceil(Math.random() * (organizers.length - 1))];  // Avoid organizer 1 as it's admin

        const image: string = `http://imgur.com/${strarray[Math.floor(Math.random() * strarray.length)]}`;
        const title: string = wordarray[Math.floor(Math.random() * wordarray.length)] + " " + wordarray[Math.floor(Math.random() * wordarray.length)];
        const organizerID: number = organizer.id;
        const eventDate: Date = new Date(
            (Math.random() * ((new Date().valueOf() - new Date(organizer.dateCreated).valueOf()) + (1000 * 60 * 60 * 24 * 120)))
            + new Date(organizer.dateCreated).valueOf()
            + (1000 * 60 * 60 * 24 * 15)
        );
        const num: number = Math.floor(Math.random() * 5) + 4;
        let overview: string = "";
        for (let i = 0; i < num; i++) {
            overview += " " + wordarray[Math.floor(Math.random() * wordarray.length)];
        };
        overview = overview.slice(1);
        const genre: string = genres[Math.floor(Math.random() * genres.length)];
        const venue: string = wordarray[Math.floor(Math.random() * wordarray.length)] + " " + wordarray[Math.floor(Math.random() * wordarray.length)];
        let eventDesc: string = "";
        const num2: number = Math.floor(Math.random() * 41) + 10;
        for (let i = 0; i < num2; i++) {
            eventDesc += " " + wordarray2[Math.floor(Math.random() * wordarray2.length)];
        };
        eventDesc = eventDesc.slice(1);
        const maxNormals: number = Math.random() * 10 > 1 ? Math.ceil(Math.random() * 100) * 5 : 0;
        const maxVIPs: number = Math.random() * 10 < 1 ? Math.ceil(Math.random() * (Math.sqrt(maxNormals))) : 0;
        const normalPrice: number = maxNormals ? (Math.floor(Math.random() * 300) + 12) * 50000 : 0;;
        const VIPPrice: number = maxVIPs ? (Math.ceil(Math.random() * 4) + 1) * normalPrice : 0;
        const artists: Array<string> = [];
        const num3: number = Math.ceil(Math.random() * 3);
        for (let i = 0; i < num3; i++) {
            artists.push(names[Math.floor(Math.random() * names.length)] + " " + names[Math.floor(Math.random() * names.length)]);
        };
        const discountType: string = maxNormals || maxVIPs ? discountTypes[Math.floor(Math.random() * 4)] : "None";
        let discountDesc: any = null;
        if (discountType === "Limited") {
            discountDesc = [{
                breakpoint: Math.ceil(Math.random() * (maxNormals / 2)),
                discount: (Math.ceil(Math.random() * 9) + 1) * 5,
            }];
        };
        if (discountType === "Deadline") {
            discountDesc = {
                deadline: new Date(eventDate.valueOf() - ((Math.floor(Math.random() * 21) + 10) * (1000 * 60 * 60 * 24))),
                discount: (Math.ceil(Math.random() * 9) + 1) * 5,
            };
        };
        if (discountType === "LimitedDeadline") {
            discountDesc = {
                limited: [{
                    breakpoint: Math.ceil(Math.random() * (maxNormals / 2)),
                    discount: (Math.ceil(Math.random() * 9) + 1) * 5,
                }],
                deadline: {
                    deadline: new Date(eventDate.valueOf() - ((Math.floor(Math.random() * 21) + 10) * (1000 * 60 * 60 * 24))),
                    discount: (Math.ceil(Math.random() * 9) + 1) * 5,
                },
            };
        };
        const creationDate: Date = new Date(new Date(organizer.dateCreated).valueOf() +
            Math.ceil(Math.random() * ((new Date().valueOf() < (eventDate.valueOf() - (1000 * 60 * 60 * 24 * 14)) ? new Date().valueOf() : (eventDate.valueOf() - (1000 * 60 * 60 * 24 * 14))) - new Date(organizer.dateCreated).valueOf())));

        try {
            const user = await axios.post(process.env.NEXT_PUBLIC_BASE_API_URL + "/data/events/" + organizerID, {
                image: image,
                title: title,
                eventDate: eventDate,
                overview: overview,
                genre: genre,
                venue: venue,
                eventDesc: eventDesc,
                maxNormals: maxNormals,
                maxVIPs: maxVIPs,
                normalPrice: normalPrice,
                VIPPrice: VIPPrice,
                artists: artists,
                discountType: discountType,
                discountDesc: discountDesc,
                dateCreated: creationDate,
            });
            console.log("Added event " + (i + 1));
        } catch (err) {
            console.log(err);
        };
    };
};