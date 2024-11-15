interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    refCode: string;
};

interface IOrganizer {
    name: string;
    email: string;
    password: string;
};

export type {
    IUser,
    IOrganizer,
};