declare module Express {
    interface Request {
        file: Multer.File;
        userData?: {
            userId: string;
            email:string;
            changePasswordDate:string;
        };
        isAccessTokenValid?: boolean;
        accessToken?: string;
        refreshToken?: string;
    }
}
