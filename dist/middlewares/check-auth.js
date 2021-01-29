"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const request_error_1 = __importDefault(require("./request-error"));
const access_blacklist_1 = __importDefault(require("../models/access-blacklist"));
const refresh_revoke_1 = __importDefault(require("../models/refresh-revoke"));
const checkAuth = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const accessToken = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        let refreshToken = req.body.refreshToken;
        if (refreshToken === undefined) {
            refreshToken = req.query.refreshToken;
        }
        if (accessToken === undefined || refreshToken === undefined) {
            throw new request_error_1.default('Authentication failed! Access and/or Refresh Tokens not sent', 401);
        }
        let tokenBlacklisted = await access_blacklist_1.default.findOne({
            "accessToken": accessToken
        }).lean() != null;
        let refreshRevoked = await refresh_revoke_1.default.findOne({
            "refreshToken": refreshToken
        }).lean() != null;
        // this is the case when the token sent has not been involved in logout or changePass
        if (!tokenBlacklisted) {
            try {
                const decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
                const changePasswordDate = decodedAccessToken.changePasswordDate;
                req.userData = {
                    userId: decodedAccessToken.userId,
                    email: decodedAccessToken.email,
                    changePasswordDate: changePasswordDate
                };
                const iat = decodedAccessToken.iat;
                console.log(changePasswordDate);
                console.log(new Date(Date.parse(changePasswordDate)).getTime());
                // checking this to discard the tokens created before password change/forget event.
                if (iat * 1000 < new Date(Date.parse(changePasswordDate)).getTime()) {
                    const error = new request_error_1.default('Access Token Expired!!!', 403);
                    return next(error);
                }
                req.isAccessTokenValid = true;
                req.accessToken = accessToken;
                req.refreshToken = refreshToken;
                next();
            }
            catch (e) {
                if (!refreshRevoked) {
                    const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
                    const iat = decodedRefreshToken.iat;
                    const changePasswordDate = decodedRefreshToken.changePasswordDate;
                    // checking this to discard the tokens created before password change/forget event.
                    if (iat * 1000 < new Date(Date.parse(changePasswordDate)).getTime()) {
                        const error = new request_error_1.default('Refresh Token Expired!!!', 403);
                        return next(error);
                    }
                    await refresh_revoke_1.default.create({ refreshToken });
                    let userId = decodedRefreshToken.userId;
                    let email = decodedRefreshToken.email;
                    req.userData = {
                        userId,
                        email,
                        changePasswordDate
                    };
                    req.isAccessTokenValid = false;
                    let newAccessToken, newRefreshToken;
                    try {
                        newAccessToken = jsonwebtoken_1.default.sign({
                            userId: userId,
                            email: email,
                            changePasswordDate: changePasswordDate
                        }, process.env.ACCESS_TOKEN_KEY, {
                            expiresIn: '1hr' // expires in 1 hours
                        });
                        newRefreshToken = jsonwebtoken_1.default.sign({
                            userId: userId,
                            email: email,
                            changePasswordDate: changePasswordDate
                        }, process.env.REFRESH_TOKEN_KEY, {
                            expiresIn: '30d' // expires in 30d
                        });
                        req.accessToken = newAccessToken;
                        req.refreshToken = newRefreshToken;
                        next();
                    }
                    catch (err) {
                        const error = new request_error_1.default('Authentication flow failed, please try again later.', 500, err);
                        return next(error);
                    }
                }
                else {
                    const error = new request_error_1.default('Authentication failed!, the refresh token have been revoked.', 401);
                    return next(error);
                }
            }
        }
        else {
            const error = new request_error_1.default('Authentication failed!, Access Token is blacklisted!!', 401);
            return next(error);
        }
    }
    catch (err) {
        const error = new request_error_1.default(`Error with token. Info: ${JSON.stringify(err)}`, 403);
        return next(error);
    }
};
exports.default = checkAuth;
