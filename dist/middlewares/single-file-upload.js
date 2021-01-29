"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleFileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};
const singleFileUpload = (path, fileName) => {
    return multer_1.default({
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path);
            },
            filename: (req, file, cb) => {
                const ext = MIME_TYPE_MAP[file.mimetype];
                cb(null, uuid_1.v1() + '.' + ext);
            }
        }),
        fileFilter: (req, file, cb) => {
            const isValid = !!MIME_TYPE_MAP[file.mimetype];
            let error = isValid ? null : new Error('Invalid mime type!');
            cb(error, isValid);
        }
    }).single(fileName);
};
exports.singleFileUpload = singleFileUpload;
