declare module Express {
    interface Request {
        file?: any;
        userData?: any;
        isValid?: boolean;
        accessToken?: string;
        refreshToken?: string;
    }
}
