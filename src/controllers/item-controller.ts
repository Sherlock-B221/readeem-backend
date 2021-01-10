import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {validate} from "../utils/validate";
import {generateCrypto} from "../utils/generate-crypto";
import {decryptCrypto} from "../utils/decrypt-crypto";
import Item from "../models/item";
import {checkTokens} from "../utils/check-tokens";

export const getAllItems: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await Item.find().lean();
        const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({"status": "success", items, ...changedTokenPair});
    } catch (err) {
        const error = new RequestError("Error in fetching items.", 400);
        next(error);
    }
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
    const itemId = req.params.id;
    try {
        const item = await Item.findById(itemId).lean();
        if (!item) {
            const error = new RequestError("Item with this id, doesn't exist.", 404);
            next(error);
        }
        const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({"status": "success", item, ...changedTokenPair});
    } catch (err) {
        const error = new RequestError("Error in fetching items of the given id.", 400);
        next(error);
    }
};

export const editItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

};

export const deleteItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {


};