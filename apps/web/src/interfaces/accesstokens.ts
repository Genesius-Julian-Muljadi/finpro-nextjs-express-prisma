import { Coupons, History, Point_Balance } from "./database_tables";

interface AccessTokenUser {
    id: number;
    email: string;
    name: string;
    role: string;
    refCode: string;
    pointBalance: number;
    // pointHistory: Array<Point_Balance>;
    // transactionHistory: Array<History>;
    // coupons: Array<Coupons>;
    iat: number;
    exp: number;
};

interface AccessTokenOrganizer {
    id: number;
    email: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
};

export type {
    AccessTokenUser,
    AccessTokenOrganizer,
};