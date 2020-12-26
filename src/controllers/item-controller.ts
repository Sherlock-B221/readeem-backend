// import Item from "../models/item";
// import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
// import {validationResult} from "express-validator";
import crypto from "crypto";

export const getAllItems: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

};

export const createItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const algorithm = "aes-192-cbc"; //algorithm to use
    const password = "Hello darkness";
    const key = crypto.scryptSync(password, 'salt', 24); //create key
    const text= "this is the text to be encrypted"; //text to be encrypted

    const iv = crypto.randomBytes(16); // generate different ciphertext everytime
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex'); // encrypted text

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
    console.log(decrypted);

};

export const getItemById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

};

export const editItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

};

export const deleteItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {


};