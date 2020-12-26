import jwt from 'jsonwebtoken';
import RequestError from './request-error';
import AccessBlackList from '../models/access-blacklist';
import RefreshRevoked from '../models/refresh-revoke';
import {NextFunction, Request, Response} from 'express';
import {DecodedToken} from "../interfaces/decoded_token";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const accessToken: string = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        const refreshToken: string = req.body.refreshToken;
        if (!accessToken && !refreshToken) {
            throw new RequestError('Authentication failed! Access and Refresh Tokens does not exist', 401);
        }
        let tokenBlacklisted = await AccessBlackList.findOne({
            "accessToken": accessToken
        }) != null;
        let refreshRevoked = await RefreshRevoked.findOne({
            "refreshToken": refreshToken
        }) != null;
        if (!tokenBlacklisted) {
            try {
                const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
                const changePasswordDate = (decodedAccessToken as DecodedToken).changePasswordDate;
                req.userData = {
                    userId: (decodedAccessToken as DecodedToken).userId,
                    email: (decodedAccessToken as DecodedToken).email,
                    changePasswordDate: changePasswordDate
                };
                const iat = (decodedAccessToken as DecodedToken).iat;
                console.log(changePasswordDate);
                console.log(new Date(Date.parse(changePasswordDate)).getTime());
                // checking this to discard the tokens created before password change/forget event.
                if (iat * 1000 < new Date(Date.parse(changePasswordDate)).getTime()) {
                    const error = new RequestError('Access Token Expired!!!', 403);
                    return next(error);
                }
                req.isAccessTokenValid = true;
                req.accessToken = accessToken;
                req.refreshToken = refreshToken;
                next();
            } catch (e) {
                if (!refreshRevoked) {
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
                    const iat = (decodedRefreshToken as DecodedToken).iat;
                    const changePasswordDate = (decodedRefreshToken as DecodedToken).changePasswordDate;
                    // checking this to discard the tokens created before password change/forget event.
                    if (iat * 1000 < new Date(Date.parse(changePasswordDate)).getTime()) {
                        const error = new RequestError('Refresh Token Expired!!!', 403);
                        return next(error);
                    }
                    await RefreshRevoked.create({refreshToken});
                    let userId = (decodedRefreshToken as DecodedToken).userId;
                    let email = (decodedRefreshToken as DecodedToken).email;
                    req.userData = {
                        userId,
                        email,
                        changePasswordDate
                    };
                    req.isAccessTokenValid = false;
                    let newAccessToken, newRefreshToken;
                    try {
                        newAccessToken = jwt.sign(
                            {
                                userId: userId,
                                email: email,
                                changePasswordDate: changePasswordDate
                            },
                            process.env.ACCESS_TOKEN_KEY, {
                                expiresIn: '6hr' // expires in 6 hours
                            }
                        );
                        newRefreshToken = jwt.sign(
                            {
                                userId: userId,
                                email: email,
                                changePasswordDate: changePasswordDate
                            },
                            process.env.REFRESH_TOKEN_KEY, {
                                expiresIn: '30d' // expires in 30d
                            }
                        );
                        req.accessToken = newAccessToken;
                        req.refreshToken = newRefreshToken;
                        next();
                    } catch (err) {
                        const error = new RequestError('Authentication flow failed, please try again later.', 500, err);
                        return next(error);
                    }
                }
            }
        } else {
            const error = new RequestError('Authentication failed!', 401);
            return next(error);
        }
    } catch (err) {
        const error = new RequestError(`Error with token. Info: ${err}`, 403);
        return next(error);
    }
};

export default checkAuth;