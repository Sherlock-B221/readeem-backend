"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptCrypto = void 0;
const crypto_1 = __importDefault(require("crypto"));
const decryptCrypto = (encryptedText) => {
    const key = crypto_1.default.scryptSync(process.env.encryptionKey, 'salt', 24);
    const iv = crypto_1.default.randomBytes(16); // generate different ciphertext everytime
    const decipher = crypto_1.default.createDecipheriv(process.env.algorithm, key, iv);
    return decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
};
exports.decryptCrypto = decryptCrypto;
