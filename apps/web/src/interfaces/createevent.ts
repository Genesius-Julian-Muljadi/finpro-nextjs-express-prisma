interface CreateEvent {
    image: string;
    title: string;
    eventDate: Date;
    overview: string;
    genre: string;
    venue: string;
    eventDesc: string;
    maxNormals: number;
    maxVIPs: number;
    normalPrice: number;
    VIPPrice: number;
    discountType: string;
};

export type {
    CreateEvent,
};