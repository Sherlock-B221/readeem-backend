import crypto from "crypto";

export const generateCrypto = (textToEncrypt:string) => {
    const key = crypto.scryptSync(process.env.encryptionKey, 'salt', 24);
    const iv = crypto.randomBytes(16); // generate different ciphertext everytime
    const cipher = crypto.createCipheriv(process.env.algorithm, key, iv);
    return cipher.update(textToEncrypt,
        'utf8',
        'hex') + cipher.final('hex');
}