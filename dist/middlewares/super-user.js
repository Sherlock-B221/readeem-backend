"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_error_1 = __importDefault(require("./request-error"));
const checkSuperUser = async (req, res, next) => {
    try {
        let superSecretKey = req.body.superSecretKey;
        if (superSecretKey === undefined) {
            superSecretKey = req.query.superSecretKey;
        }
        if (superSecretKey === process.env.SUPER_SECRET_KEY) {
            next();
        }
        else {
            const error = new request_error_1.default(`Not super user!!!`, 403);
            return next(error);
        }
    }
    catch (e) {
        const error = new request_error_1.default(`Error occurred while checking super user.`, 403);
        return next(error);
    }
};
exports.default = checkSuperUser;
