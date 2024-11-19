interface AccessToken {
    id: string;
    email: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
};

export type {
    AccessToken,
};