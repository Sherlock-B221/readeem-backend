"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCrypto = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateCrypto = (textToEncrypt) => {
    const key = crypto_1.default.scryptSync(process.env.encryptionKey, 'salt', 24);
    const iv = crypto_1.default.randomBytes(16); // generate different ciphertext everytime
    const cipher = crypto_1.default.createCipheriv(process.env.algorithm, key, iv);
    return cipher.update(textToEncrypt, 'utf8', 'hex') + cipher.final('hex');
};
exports.generateCrypto = generateCrypto;
