declare module Express {
    interface Request {
        file?: any;
        userData?: any;
        isAccessTokenValid?: boolean;
        accessToken?: string;
        refreshToken?: string;
    }
}
