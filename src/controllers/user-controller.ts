// import User from "../models/user";
// import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
// import {validationResult} from "express-validator";

export const getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const getUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const addRewardPoints: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const editUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const removeRewardPoints: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const addToCart: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const removeFromCart: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};