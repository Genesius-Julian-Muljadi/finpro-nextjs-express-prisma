interface AccessTokenUser {
    id: number;
    email: string;
    name: string;
    role: string;
    refCode: string;
    pointBalance: number;
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