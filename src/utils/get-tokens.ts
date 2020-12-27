import jwt from "jsonwebtoken";
import RequestError from "../middlewares/request-error";

export const getTokens = (id: string, email: string, changePasswordDate: Date): { accessToken: string, refreshToken: string } => {
    let accessToken, refreshToken;
    try {
        accessToken = jwt.sign(
            {
                userId: id,
                email: email,
                changePasswordDate: changePasswordDate
            },
            process.env.ACCESS_TOKEN_KEY, {
                expiresIn: '1hr'
            }
        );
        refreshToken = jwt.sign(
            {
                userId: id,
                email: email,
                changePasswordDate: changePasswordDate
            },
            process.env.REFRESH_TOKEN_KEY, {
                expiresIn: '30d'
            }
        );
        return {accessToken, refreshToken};
    } catch (err) {
        throw new RequestError('Logging in failed, please try again later.', 500, err);
    }
};