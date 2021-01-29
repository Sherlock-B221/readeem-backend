"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const request_error_1 = __importDefault(require("../middlewares/request-error"));
const validate = (req, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        let params = "";
        errors.array().forEach((e) => {
            params += `${e.param}, `;
        });
        params += "triggered the error!!";
        return next(new request_error_1.default(params, 422));
    }
};
exports.validate = validate;
