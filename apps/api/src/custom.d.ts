export type User = {
    email: string;
    refCode: string;
};

export type Organizer = {
    email: string;
};

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

declare global {
    namespace Express {
        export interface Request {
            organizer?: Organizer;
        }
    }
}