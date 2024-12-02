interface Users {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    pointBalance: number;
    referralCode: string;
    failedLogins: number;
    active: string;
    emailVerified: boolean;
    dateCreated: Date;
    updated: Date;
    coupons: Array<Coupons>;
    codeUsed: Array<Point_Balance>;
};

interface Organizers {
    id: number;
    name: string;
    email: string;
    password: string;
    failedLogins: number;
    active: string;
    emailVerified: true;
    dateCreated: Date;
    updated: Date;
};

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
    maxNormals: number | null;
    maxVIPs: number;
    normalsSold: number;
    VIPsSold: number;
    normalPrice: number;
    VIPPrice: number | null;
    discountType: string;
    ratingAvg: number | null;
    revenue: number;
    dateCreated: Date;
    updated: Date;
};

interface Transactions {
    id: number;
    userID: number;
    eventID: number | null;
    ticketCount: number;
    VIPs: number;
    normalPrice: number;
    VIPPrice: number;
    discount: number;
    discountDesc: string | null;
    pointDiscount: number | null;
    total: number;
    type: string;
    dateCreated: Date;
};

interface Events_Discounts_Limited {
    id: number;
    eventID: number;
    breakpoint: number;
    discount: number;
};

interface Events_Discounts_Deadline {
    id: number;
    eventID: number;
    deadline: Date;
    discount: number;
};

interface Event_Ratings {
    id: number;
    eventID: number;
    rating: number;
    feedback: string;
    dateCreated: Date;
};

export type {
    Users,
    Organizers,
    History,
    Point_Balance,
    Coupons,
    Events,
    Transactions,
    Events_Discounts_Limited,
    Events_Discounts_Deadline,
    Event_Ratings,
};