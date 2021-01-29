"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const request_error_1 = __importDefault(require("../middlewares/request-error"));
const getTokens = (id, email, changePasswordDate) => {
    let accessToken, refreshToken;
    try {
        accessToken = jsonwebtoken_1.default.sign({
            userId: id,
            email: email,
            changePasswordDate: changePasswordDate
        }, process.env.ACCESS_TOKEN_KEY, {
            expiresIn: '1hr'
        });
        refreshToken = jsonwebtoken_1.default.sign({
            userId: id,
            email: email,
            changePasswordDate: changePasswordDate
        }, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: '30d'
        });
        return { accessToken, refreshToken };
    }
    catch (err) {
        throw new request_error_1.default('Logging in failed, please try again later.', 500, err);
    }
};
exports.getTokens = getTokens;
