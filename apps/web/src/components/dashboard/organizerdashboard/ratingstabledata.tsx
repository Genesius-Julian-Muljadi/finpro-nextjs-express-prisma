import { Event_Ratings, Events } from "@/interfaces/database_tables";
import axios from "axios";

export default async function RatingsTableData({ event }: { event: Events }) {
    const data2 = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/auth/ratingsevent/" + event.id);
    const ratingsData: Array<Event_Ratings> = data2.data.data;
    let total: number = 0;
    for (let k in ratingsData) {
        total += ratingsData[k].rating;
    };
    total = total / ratingsData.length;
    
    return (
        <div>
            {total ? Math.round(total * 100)/100 : "-"}
        </div>
    );
};