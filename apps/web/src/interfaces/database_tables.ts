interface History {
    id: number;
    userID: number;
    transactionID: number;
};

interface Point_Balance {
    id: number;
    user1ID: number;
    user2ID: number;
    nominal: number;
    expiryDate: Date;
    dateCreated: Date;
};

interface Coupons {
    id: number;
    code: string;
    userID: number | null;
    organizerID: number;
    organizerName: string;
    discount: number;
    expiryDate: Date | null;
    active: Boolean;
    dateCreated: Date;
    updated: Date;
};

interface Events {
    id: number;
    organizerID: number;
    image: string;
    title: string;
    eventDate: Date;
    overview: string;
    genre: string;
    venue: string;
    eventDesc: string;
    maxUsers: number;
    ticketsSold: number;
    maxVIPs: number;
    VIPPrice: number | null;
    normalPrice: number;
    discountType: string;
    ratingAvg: number | null;
    dateCreated: Date;
    updated: Date;
};

interface Transactions {
    id: number;
    userID: number;
    eventID: number | null;
    ticketCount: number;
    VIPs: number;
    normalPrice: number | null;
    VIPPrice: number | null;
    discount: number;
    discountDesc: string | null;
    pointDiscount: number | null;
    total: number;
    type: string;
    dateCreated: Date;
};

export type {
    History,
    Point_Balance,
    Coupons,
    Events,
    Transactions,
};