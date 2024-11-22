import EventPageByIDView from "@/components/events/event";

export default async function EventPageByID({ params }: { params: Promise<{ eventid: string }> }) {
    const id: string = (await params).eventid;

    return (
        <EventPageByIDView id={parseInt(id)}/>
    );
};