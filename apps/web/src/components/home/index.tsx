import "../../index.css";

export default function HomeView() {
    return (
        <div>
            <div className="flex flex-col gap-6 *:border *:border-black mb-9">
                <div>
                    Slideshow
                </div>
                <div>
                    Genres
                </div>
                <div>
                    Location filters
                </div>
                <div>
                    Sample events, sort by date
                </div>
                <div>
                    Miscellaneous upcoming events, sort by date
                </div>
            </div>
        </div>
    );
};