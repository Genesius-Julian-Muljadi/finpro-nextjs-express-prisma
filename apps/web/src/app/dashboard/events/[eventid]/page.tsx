import DashboardEventPageByIDView from "@/components/dashboard/organizerdashboard/statistics/single";


export default async function DashboardEventPageByID({ params }: { params: Promise<{ eventid: string }> }) {
    const id: string = (await params).eventid;

    return (
        <DashboardEventPageByIDView id={parseInt(id)}/>
    );
};