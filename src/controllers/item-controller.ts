import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {validate} from "../utils/validate";
import {generateCrypto} from "../utils/generate-crypto";
import {decryptCrypto} from "../utils/decrypt-crypto";
import Item from "../models/item";
import {checkTokens} from "../utils/check-tokens";
import {IItem} from "../interfaces/item-interface";

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
    validate(req, next);
    const {
        couponCode,
        name,
        description,
        sellerName,
        sellerEmail,
        sellerNumber,
        discountedRewardPrice,
        tags,
        categories,
        price,
    } = req.body;
    let itemImg;
    try {
        itemImg = req.file.path;
    } catch (err) {
        console.log(err);
        const error = new RequestError(err.message, err.code, err);
        return next(error);
    }
    itemImg = 'https://win75.herokuapp.com/' + itemImg;
    try {
        const encryptedCode = generateCrypto(couponCode);
        const newItem = new Item({
            itemImg,
            name,
            description,
            sellerName,
            sellerEmail,
            sellerNumber,
            discountedRewardPrice,
            tags,
            categories,
            price,
            couponCode: encryptedCode
        });
        await newItem.save();
        await res.json({
            "status": "success",
            newItem
        });
    } catch (err) {
        const error = new RequestError("Error in adding item.", 400, err);
        next(error);
    }
};

export const getItemCouponCode: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    let item: IItem;
    try {
        item = await Item.findById(itemId).lean();
        if (!item) {
            const error = new RequestError("Item with this id, doesn't exist.", 404);
            next(error);
        }
        const encryptedCode = item.couponCode;
        if (!encryptedCode) {
            const error = new RequestError('Code not sent!', 404);
            next(error);
        }
        const decryptedCode = decryptCrypto(encryptedCode);
        const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({"status": "success", decryptedCode, ...changedTokenPair});
    } catch (e) {
        const error = new RequestError('Error in getting decrypted code!', 400);
        next(error);
    }
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
    const itemId = req.params.id;
    let item: IItem;
    try {
        const {
            couponCode,
            name,
            description,
            sellerName,
            sellerEmail,
            sellerNumber,
            discountedRewardPrice,
            tags,
            categories,
            price,
        } = req.body;
        let itemImg;
        try {
            itemImg = req.file.path;
        } catch (err) {
            console.log(err);
            const error = new RequestError(err.message, err.code, err);
            return next(error);
        }
        itemImg = 'https://win75.herokuapp.com/' + itemImg;
        item = await Item.findById(itemId);
        if (!item) {
            const error = new RequestError("Item with this id, doesn't exist.", 404);
            next(error);
        }
        item.couponCode = couponCode;
        item.name = name;
        item.tags = tags;
        item.categories = categories;
        item.price = price;
        item.itemImg = itemImg;
        item.sellerEmail = sellerEmail;
        item.sellerName = sellerName;
        item.sellerNumber = sellerNumber;
        item.description = description;
        item.discountedRewardPrice = discountedRewardPrice;
        await item.save();
        res.status(200).json({
            "status":"success",
            item
        });
    } catch (err) {
        const error = new RequestError('Error in editing item!!', 400);
        next(error);
    }
};

export const deleteItem: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        await Item.deleteOne({_id: id});
        await res.json({
            "status": "success",
            "message": "Item deleted successfully,if it existed."
        });
    } catch (e) {
        const error = new RequestError("Error in deleting item", 400, e);
        next(error);
    }
};

export const itemFullSearch: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {


};

export const itemFuzzySearch: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {


};