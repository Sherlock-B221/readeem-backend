import User from "../models/user";
import Book from "../models/book";
import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {checkTokens} from "../utils/check-tokens";
import {validate} from "../utils/validate";
import {IUser} from "../interfaces/user-interface";
import {IBook} from "../interfaces/book-interface";

export const getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let users;
    try {
        users = await User.find().lean();
        await res.json({"status": "success", users});

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
            delete user.password;
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
    let favBooks;
    try {
        const userId = req.userData.userId;
        favBooks = await User.findById(userId).select({favBooks: 1}).populate('favBooks').lean();
        if (favBooks) {
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success"
                , "favBooks": favBooks,
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
        const error = new RequestError("Error in fetching user's favBooks.", 400);
        next(error);
    }
};

export const getUserInProgress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let inProgressBooks;
    try {
        const userId = req.userData.userId;
        inProgressBooks = await User.findById(userId).select({inProgressBooks: 1})
            .populate('inProgressBooks').lean();
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
    let completedBooks;
    try {
        const userId = req.userData.userId;
        completedBooks = await User.findById(userId).select({completedBooks: 1}).lean();
        if (completedBooks) {
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success"
                , "completedBooks": completedBooks,
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

export const addRewardPoints: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const rewardPoints = req.body.rewardPoints;
    const userId = req.userData.userId;
    try {
        const user:IUser = await User.findById(userId);
        if (user) {
            user.reward += rewardPoints;
            await user.save();
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
                ...changedTokenPair
            });
        } else {
            await res.json({
                "status": "failed"
                , "message": "Error in finding user"
            });
        }
    } catch (err) {
        const error = new RequestError("Error in adding reward points.", 400, err);
        next(error);
    }
};

export const getUserCart: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let cartItems;
    try {
        const userId = req.userData.userId;
        cartItems = await User.findById(userId).select({cart: 1}).populate('cart').lean();
        if (cartItems) {
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success"
                , "cartItems": cartItems,
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

export const addToCart: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const items = req.body.items;
    const userId = req.userData.userId;
    try {
        const user:IUser = await User.findById(userId);
        if (user) {
            user.cart.push(items);
            await user.save();
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
                ...changedTokenPair
            });
        } else {
            await res.json({
                "status": "failed"
                , "message": "Error in finding user"
            });
        }
    } catch (err) {
        const error = new RequestError("Error in adding items to cart.", 400, err);
        next(error);
    }
};

export const editProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "status": "TS works bitch"
    });
};

export const removeFromCart: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const itemsToBeRemoved = req.body.items;
    const userId = req.userData.userId;
    try {
        const user:IUser = await User.findById(userId);
        if (user) {
            user.cart = user.cart.filter((item) => itemsToBeRemoved.includes(item));
            await user.save();
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
                ...changedTokenPair
            });
        } else {
            await res.json({
                "status": "failed"
                , "message": "Error in finding user"
            });
        }
    } catch (err) {
        const error = new RequestError("Error in adding removing item from cart.", 400, err);
        next(error);
    }
};

export const removeFromFav: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const bId = req.body.bookId;
    const userId = req.userData.userId;
    try {
        const user:IUser = await User.findById(userId);
        if (user) {
            user.favBooks = user.favBooks.filter((bookId) => {
                return bId==bookId;
            });
            await user.save();
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
                ...changedTokenPair
            });
        } else {
            await res.json({
                "status": "failed"
                , "message": "Error in finding user"
            });
        }
    } catch (err) {
        const error = new RequestError("Error in removing book from fav.", 400, err);
        next(error);
    }
};


export const addToCompleted: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const userId = req.userData.userId;

};

export const addToFav: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const userId = req.userData.userId;
    const bookId = req.body.bookId;
    try {
        const user: IUser = await User.findById(userId);
        if (user) {
            user.favBooks.push(bookId);
            await user.save();
            const changedTokenPair = checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
                ...changedTokenPair
            });
        } else {
            await res.json({
                "status": "failed"
                , "message": "Error in finding user"
            });
        }
    } catch (err) {
        const error = new RequestError("Error in adding book to fav.", 400, err);
        next(error);
    }
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