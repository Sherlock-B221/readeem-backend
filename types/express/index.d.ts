declare module Express {
    interface Request {
        file?: any;
        userData?: {
            userId: string;
            email:string;
            changePasswordDate:Date;
        };
        isAccessTokenValid?: boolean;
        accessToken?: string;
        refreshToken?: string;
    }
}
