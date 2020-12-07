import jwt from 'jsonwebtoken';
import RequestError from './request-error';
import AccessBlackList from '../models/access_blacklist';
import {NextFunction, Request, Response} from 'express';
import {DecodedToken} from "../interfaces/decoded_token";

module.exports = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new RequestError('Authentication failed! token does not exist', 404);
        }
        let tokenBlacklisted = await AccessBlackList.findOne({
            "token": token
        }) != null;

        if (!tokenBlacklisted) {
            const decodedToken = jwt.verify(token, process.env.JWT_KEY);
            req.userData = {userId: (decodedToken as DecodedToken).userId};
            next();

        } else {
            const error = new RequestError('Authentication failed!', 403);
            return next(error);
        }
    } catch (err) {
        const error = new RequestError("Token not sent!", 403);
        return next(error);
    }
};
