import { Events, Events_Discounts_Deadline, Events_Discounts_Limited } from "@/interfaces/database_tables";
import axios from "axios";

export default async function DiscountTableData({ event }: { event: Events }) {
    const data = await axios.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/auth/eventdiscount/" + event.id);
    console.log("Here's the data:");
    console.log(data.data.data);
    const discountData: {
        limited: Array<Events_Discounts_Limited>;
        deadline: Events_Discounts_Deadline;
    } = data.data.data;

    if (String(event.discountType) === "None") {
        return (
            <div>-</div>
        );
    } else if (String(event.discountType) === "Limited") {
        return (
            <div className="flex flex-row gap-0">
                <p>Limited: </p>
                {discountData.limited?.map((item) => (
                    <p>{item.breakpoint}|{item.discount}% </p>
                ))}
            </div>
        );
    } else if (String(event.discountType) === "Deadline") {
        return (
            <div>
                Deadline: {new Date(discountData.deadline.deadline).toLocaleDateString()}|{discountData.deadline.discount}%
            </div>
        );
    } else if (String(event.discountType) === "LimitedDeadline") {
        return (
            <div className="grid grid-cols-1 grid-rows-2">
                <div className="flex flex-row gap-0">
                    <p>Limited: </p>
                    {discountData.limited?.map((item) => (
                        <p>{item.breakpoint}|{item.discount}% </p>
                    ))}
                </div>
                <div>
                    Deadline: {new Date(discountData.deadline.deadline).toLocaleDateString()}|{discountData.deadline.discount}%
                </div>
            </div>
        );
    } else {
        return (
            <div>Error</div>
        );
    };
};