export const checkTokens = (isAccessTokenValid: boolean | undefined, refreshToken: string | undefined, accessToken: string | undefined): { accessToken: string, refreshToken: string } => {
    if (!isAccessTokenValid)
        return {accessToken, refreshToken};
};