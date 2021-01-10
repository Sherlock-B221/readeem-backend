import Order from "../models/order";
import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
import User from "../models/user";
import {checkTokens} from "../utils/check-tokens";
import {validate} from "../utils/validate";
import {IUser} from "../interfaces/user-interface";
import {IItem} from "../interfaces/item-interface";
import {IOrder, IOrderItem} from "../interfaces/order-interface";

export const getAllOrders: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find().lean();
        await res.json({"status": "success", orders});
    } catch (err) {
        const error = new RequestError("Error in fetching orders.", 400);
        next(error);
    }
};

export const createOrder: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    try {
        const {items, totalRewardPoints}:{items:Array<IOrderItem>,totalRewardPoints:number} = req.body;
        let userWithOrder: IUser;
        const userId = req.userData.userId;
        userWithOrder = await User.findById(userId);
        const orderDate = new Date();
        if (userWithOrder) {
            if (userWithOrder.reward < totalRewardPoints) {
                await res.json({"status": "failed", "message": "Insufficient Funds"});
            }
            const newOrder = new Order({
                items,
                totalRewardPoints,
                userId,
                orderDate
            });
            const newOrderId = newOrder._id;
            userWithOrder.reward -= totalRewardPoints;
            userWithOrder.previousOrders.push(newOrderId);
            items.forEach((item: IOrderItem) => {
                if (userWithOrder.cart.includes(item._id)) {
                    userWithOrder.cart = userWithOrder.cart
                        .filter(cartItem => cartItem._id !== item._id);
                }
            })
            await Promise.all([newOrder.save(), userWithOrder.save()]);
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success"
                , "userWithOrder": userWithOrder,
                ...changedTokenPair
            });
        } else {
            await res.json({
                "status": "failed"
                , "message": "Error in finding user"
            });
        }
    } catch (err) {
        const error = new RequestError("Error in fetching user's cart.", 400, err);
        next(error);
    }
};

export const getOrderById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId).lean();
        if (!order) {
            const error = new RequestError("Order with this id, doesn't exist.", 404);
            next(error);
        }
        const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({"status": "success", order, ...changedTokenPair});
    } catch (err) {
        const error = new RequestError("Error in fetching orders of the given user.", 400);
        next(error);
    }
};

export const getUserOrders: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userData.userId;
    try {
        const orders = await Order.find({userId}).lean();
        const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
        await res.json({"status": "success", orders, ...changedTokenPair});
    } catch (err) {
        const error = new RequestError("Error in fetching orders of the given user.", 400);
        next(error);
    }
};