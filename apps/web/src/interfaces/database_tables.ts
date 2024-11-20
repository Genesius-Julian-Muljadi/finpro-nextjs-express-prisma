interface History {
    id: number;
    userID: number;
    eventID: number;
};

interface Point_Balance {
    id: number;
    user1ID: number;
    user2ID: number;
    nominal: number;
    expiryDate: Date;
    updatedAt: Date;
};

interface Coupons {
    id: number;
    code: string;
    userID: number | null;
    organizerID: number;
    discount: number;
    expiryDate: Date | null;
    active: Boolean;
    dateCreated: Date;
    updatedAt: Date;
};

export type {
    History,
    Point_Balance,
    Coupons,
};