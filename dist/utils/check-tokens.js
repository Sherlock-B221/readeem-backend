"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTokens = void 0;
const checkTokens = (isAccessTokenValid, refreshToken, accessToken) => {
    if (!isAccessTokenValid)
        return { accessToken, refreshToken };
};
exports.checkTokens = checkTokens;
