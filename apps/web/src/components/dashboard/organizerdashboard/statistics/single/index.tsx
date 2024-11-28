import InvalidDashboardEvents from "../dashboardinvalidevent";

export default function DashboardEventPageByIDView({ id }: { id: number }) {
    if (!id) {
        return <InvalidDashboardEvents />;
    };

    return (
        <div>
            hello, world! dashboardeventsid {id}
        </div>
    );
};