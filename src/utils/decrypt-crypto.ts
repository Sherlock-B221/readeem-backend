import crypto from "crypto";

export const decryptCrypto = (encryptedText:string) => {
    const key = crypto.scryptSync(process.env.encryptionKey, 'salt', 24);
    const iv = crypto.randomBytes(16); // generate different ciphertext everytime
    const decipher = crypto.createDecipheriv(process.env.algorithm, key, iv);
    return decipher.update(encryptedText,
        'hex',
        'utf8') + decipher.final('utf8'); //deciphered text
}