export type User = {
    email: string;
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