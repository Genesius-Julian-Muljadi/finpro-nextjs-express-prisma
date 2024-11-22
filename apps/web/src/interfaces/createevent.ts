interface CreateEvent {
    image: string;
    title: string;
    eventDate: Date;
    overview: string;
    genre: string;
    venue: string;
    eventDesc: string;
    maxNormals: number | null;
    maxVIPs: number;
    normalPrice: number;
    VIPPrice: number | null;
    discountType: string;
};

export type {
    CreateEvent,
};