import User from "../models/user";
import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {checkTokens} from "../utils/check-tokens";
// import {validationResult} from "express-validator";

export const getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let users;
    try {
        users = await User.find().lean();
        if (users.length > 0)
            await res.json({"status": "success", users});
        else
            await res.json({"status": "failed", "message": "Users doesn't exists!!"});

    } catch (err) {
        const error = new RequestError("Error in fetching users.", 400);
        next(error);
    }
};

export const getUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let user;
    try {
        const userId = req.params.id;
        user = await User.findById(userId).lean();
        if (user) {
            await res.json({
                "status": "success"
                , "user": user
            });
        } else {
            await res.json({
                "status": "failed"
                , "message": "Error in finding user"
            });
        }
    } catch (err) {
        console.log(err)
        const error = new RequestError("Error in fetching user's profile.", 400);
        next(error);
    }
};

export const getUserFav: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
};

export const getUserInProgress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let inProgressBooks;
    try {
        const userId = req.userData.userId;
        inProgressBooks = await User.findById(userId).select({inProgressBooks: 1}).lean();
        if (inProgressBooks) {
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success"
                , "inProgressBooks": inProgressBooks,
                ...changedTokenPair
            });
        } else {
            await res.json({
                "status": "failed"
                , "message": "Error in finding user"
            });
        }
    } catch (err) {
        console.log(err)
        const error = new RequestError("Error in fetching user's in progress.", 400);
        next(error);
    }
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