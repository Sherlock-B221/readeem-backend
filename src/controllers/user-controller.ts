// import User from "../models/user";
// import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
// import {validationResult} from "express-validator";

export const getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const getUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const getUserFav: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const getUserInProgress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const getUserCompleted: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const addRewardPoints: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const editUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};


export const getUserCart: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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

export const removeFromFav: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const removeFromInProgress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const addToCompleted: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const addToFav: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const updateInProgress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const addToInProgress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};