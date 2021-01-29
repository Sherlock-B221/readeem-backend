"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrders = exports.getOrderById = exports.createOrder = exports.getAllOrders = void 0;
const order_1 = __importDefault(require("../models/order"));
const request_error_1 = __importDefault(require("../middlewares/request-error"));
const user_1 = __importDefault(require("../models/user"));
const check_tokens_1 = require("../utils/check-tokens");
const validate_1 = require("../utils/validate");
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await order_1.default.find().lean();
        await res.json({ "status": "success", orders });
    }
    catch (err) {
        const error = new request_error_1.default("Error in fetching orders.", 400);
        next(error);
    }
};
exports.getAllOrders = getAllOrders;
const createOrder = async (req, res, next) => {
    validate_1.validate(req, next);
    try {
        const { items, totalRewardPoints } = req.body;
        let userWithOrder;
        const userId = req.userData.userId;
        userWithOrder = await user_1.default.findById(userId);
        const orderDate = new Date();
        if (userWithOrder) {
            if (userWithOrder.reward < totalRewardPoints) {
                await res.json({ "status": "failed", "message": "Insufficient Funds" });
            }
            const newOrder = new order_1.default({
                items,
                totalRewardPoints,
                userId,
                orderDate
            });
            const newOrderId = newOrder._id;
            userWithOrder.reward -= totalRewardPoints;
            userWithOrder.previousOrders.push(newOrderId);
            items.forEach((item) => {
                if (userWithOrder.cart.includes(item._id)) {
                    userWithOrder.cart = userWithOrder.cart
                        .filter(cartItem => cartItem._id !== item._id);
                }
            });
            await Promise.all([newOrder.save(), userWithOrder.save()]);
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "userWithOrder": userWithOrder,
                ...changedTokenPair
            });
        }
        else {
            await res.json({
                "status": "failed",
                "message": "Error in finding user"
            });
        }
    }
    catch (err) {
        const error = new request_error_1.default("Error in fetching user's cart.", 400, err);
        next(error);
    }
};
exports.createOrder = createOrder;
const getOrderById = async (req, res, next) => {
    const orderId = req.params.id;
    try {
        const order = await order_1.default.findById(orderId).lean();
        if (!order) {
            const error = new request_error_1.default("Order with this id, doesn't exist.", 404);
            next(error);
        }
        const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({ "status": "success", order, ...changedTokenPair });
    }
    catch (err) {
        const error = new request_error_1.default("Error in fetching orders of the given user.", 400);
        next(error);
    }
};
exports.getOrderById = getOrderById;
const getUserOrders = async (req, res, next) => {
    const userId = req.userData.userId;
    try {
        const orders = await order_1.default.find({ userId }).lean();
        const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({ "status": "success", orders, ...changedTokenPair });
    }
    catch (err) {
        const error = new request_error_1.default("Error in fetching orders of the given user.", 400);
        next(error);
    }
};
exports.getUserOrders = getUserOrders;
