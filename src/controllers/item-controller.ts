// import Item from "../models/item";
import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
// import {validationResult} from "express-validator";
import {validate} from "../utils/validate";
import {generateCrypto} from "../utils/generate-crypto";
import {decryptCrypto} from "../utils/decrypt-crypto";

export const getAllItems: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

};

export const createItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next)
    const {couponCode} = req.body;
    const encryptedCode = generateCrypto(couponCode)

};

export const getItemCouponCode: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const encryptedCode = req.params.code;
    if (!encryptedCode) {
        const error = new RequestError('Code not sent!', 404);
        next(error);
    }
    const decryptedCode = decryptCrypto(encryptedCode)
};

export const getItemById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

};

export const editItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

};

export const deleteItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {


};