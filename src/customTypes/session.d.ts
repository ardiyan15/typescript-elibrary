import 'express-session';

declare module 'express-session' {
    interface SessionData {
        frontoffice?: {
            jwt?: string;
        };

        backoffice?: {
            jwt?: string;
        };
    }
}