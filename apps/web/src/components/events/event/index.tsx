import InvalidEvent from "../invalidevent";

export default function EventPageByIDView({ id }: { id: number }) {
    if (!id) {
        return <InvalidEvent />;
    };
    try {
        return (
            <div>
                <div className="flex flex-col gap-6">
                    <div>
                        Event image
                    </div>
                    <div>
                        Event title & leads (overview)
                    </div>
                    <div className="grid grid-cols-2 grid-rows-1 gap-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                Event time & date
                                If event has passed, replace with ratings & review
                            </div>
                            <div>
                                Event venue
                            </div>
                            <div>
                                Event description
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <a href={`/events/purchase/${id}`}>
                                    Purchase tickets
                                </a>
                            </div>
                            <div>
                                VIP Tickets left
                            </div>
                            <div>
                                VIP ticket price
                            </div>
                            <div>
                                Normal Tickets left
                            </div>
                            <div>
                                Normal ticket price
                            </div>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        );
    } catch (err) {
        console.log(err);
        return null;
    };
};