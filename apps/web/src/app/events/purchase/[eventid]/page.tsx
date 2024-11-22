import EventPurchasePageByIDView from "@/components/events/purchase";

export default async function EventPurchasePageByID({ params }: { params: Promise<{ eventid: string }> }) {
    const id: string = (await params).eventid;

    return (
        <EventPurchasePageByIDView id={parseInt(id)}/>
    );
};