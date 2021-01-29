"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemFuzzySearch = exports.itemFullSearch = exports.deleteItem = exports.editItem = exports.getItemById = exports.getItemCouponCode = exports.createItem = exports.getAllItems = void 0;
const request_error_1 = __importDefault(require("../middlewares/request-error"));
const validate_1 = require("../utils/validate");
const generate_crypto_1 = require("../utils/generate-crypto");
const decrypt_crypto_1 = require("../utils/decrypt-crypto");
const item_1 = __importDefault(require("../models/item"));
const check_tokens_1 = require("../utils/check-tokens");
const getAllItems = async (req, res, next) => {
    try {
        const items = await item_1.default.find().lean();
        const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({ "status": "success", items, ...changedTokenPair });
    }
    catch (err) {
        const error = new request_error_1.default("Error in fetching items.", 400);
        next(error);
    }
};
exports.getAllItems = getAllItems;
const createItem = async (req, res, next) => {
    validate_1.validate(req, next);
    const { couponCode, name, description, sellerName, sellerEmail, sellerNumber, discountedRewardPrice, tags, categories, price, } = req.body;
    let itemImg;
    try {
        itemImg = req.file.path;
    }
    catch (err) {
        console.log(err);
        const error = new request_error_1.default(err.message, err.code, err);
        return next(error);
    }
    itemImg = 'https://win75.herokuapp.com/' + itemImg;
    try {
        const encryptedCode = generate_crypto_1.generateCrypto(couponCode);
        const newItem = new item_1.default({
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
    }
    catch (err) {
        const error = new request_error_1.default("Error in adding item.", 400, err);
        next(error);
    }
};
exports.createItem = createItem;
const getItemCouponCode = async (req, res, next) => {
    const itemId = req.params.id;
    let item;
    try {
        item = await item_1.default.findById(itemId).lean();
        if (!item) {
            const error = new request_error_1.default("Item with this id, doesn't exist.", 404);
            next(error);
        }
        const encryptedCode = item.couponCode;
        if (!encryptedCode) {
            const error = new request_error_1.default('Code not sent!', 404);
            next(error);
        }
        const decryptedCode = decrypt_crypto_1.decryptCrypto(encryptedCode);
        const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({ "status": "success", decryptedCode, ...changedTokenPair });
    }
    catch (e) {
        const error = new request_error_1.default('Error in getting decrypted code!', 400);
        next(error);
    }
};
exports.getItemCouponCode = getItemCouponCode;
const getItemById = async (req, res, next) => {
    const itemId = req.params.id;
    try {
        const item = await item_1.default.findById(itemId).lean();
        if (!item) {
            const error = new request_error_1.default("Item with this id, doesn't exist.", 404);
            next(error);
        }
        const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({ "status": "success", item, ...changedTokenPair });
    }
    catch (err) {
        const error = new request_error_1.default("Error in fetching items of the given id.", 400);
        next(error);
    }
};
exports.getItemById = getItemById;
const editItem = async (req, res, next) => {
    const itemId = req.params.id;
    let item;
    try {
        const { couponCode, name, description, sellerName, sellerEmail, sellerNumber, discountedRewardPrice, tags, categories, price, } = req.body;
        let itemImg;
        try {
            itemImg = req.file.path;
        }
        catch (err) {
            console.log(err);
            const error = new request_error_1.default(err.message, err.code, err);
            return next(error);
        }
        itemImg = 'https://win75.herokuapp.com/' + itemImg;
        item = await item_1.default.findById(itemId);
        if (!item) {
            const error = new request_error_1.default("Item with this id, doesn't exist.", 404);
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
            "status": "success",
            item
        });
    }
    catch (err) {
        const error = new request_error_1.default('Error in editing item!!', 400);
        next(error);
    }
};
exports.editItem = editItem;
const deleteItem = async (req, res, next) => {
    const id = req.params.id;
    try {
        await item_1.default.deleteOne({ _id: id });
        await res.json({
            "status": "success",
            "message": "Item deleted successfully,if it existed."
        });
    }
    catch (e) {
        const error = new request_error_1.default("Error in deleting item", 400, e);
        next(error);
    }
};
exports.deleteItem = deleteItem;
const itemFullSearch = async (req, res, next) => {
};
exports.itemFullSearch = itemFullSearch;
const itemFuzzySearch = async (req, res, next) => {
};
exports.itemFuzzySearch = itemFuzzySearch;
