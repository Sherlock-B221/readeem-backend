import User from "../models/user";
import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {checkTokens} from "../utils/check-tokens";
import {validate} from "../utils/validate";
import {IUser} from "../interfaces/user-interface";
import {BookMark} from "../interfaces/book-mark";
import {IOrderItem} from "../interfaces/order-interface";

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
        const user: IUser = await User.findById(userId);
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
        const user: IUser = await User.findById(userId);
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

export const updateInCart: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    try {
        const {cartItem}: { cartItem: IOrderItem } = req.body;
        const {userId} = req.userData;
        const user: IUser = await User.findById(userId);
        let foundCartIndex = false;
        if (user) {
            for (let i = 0; i < user.inProgressBooks.length; i++) {
                if (user.cart[i]._id === cartItem._id) {
                    user.cart[i] = cartItem;
                    foundCartIndex = true;
                    break;
                }
            }
            if (!foundCartIndex) {
                await res.json({
                    "status": "failed"
                    , "message": "ItemId not in cart list."
                });
            }
            // As a user is confused about the quantity, it's wise to keep it at 1st index for faster results.
            user.cart.reverse();
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
                , "message": "Error in updating cart item of user"
            });
        }
    } catch (e) {
        const error = new RequestError("Error in updating items in cart.", 400, e);
        next(error);
    }
};

export const editProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    //validation
    validate(req, next);
    const {name, email, password, mobile, imgHash} = req.body;
    // if email is sent, then revoke thirdParty access.
    const userId = req.userData.userId;
    let existingUser;
    try {
        existingUser = await User.findById(userId);
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);
        return next(error);
    }
    if (!existingUser) {
        const error = new RequestError("User doesn't exist.", 500,);
        return next(error);
    }
    try {
        let filePath;
        if (req.file) {
            filePath = req.file.path;
        } else {
            filePath = 'uploads/images/DUser.png';
        }
        filePath = 'https://win75.herokuapp.com/' + filePath;
        //TODO: change url


    } catch (err) {
        const error = new RequestError("Error in editing user.", 500, err);
        return next(error);
    }
};

export const removeFromCart: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const itemsToBeRemoved: Array<string> = req.body.items;
    const userId = req.userData.userId;
    try {
        const user: IUser = await User.findById(userId);
        if (user) {
            user.cart = user.cart.filter((item) => !itemsToBeRemoved.includes(item._id));
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
        const user: IUser = await User.findById(userId);
        if (user) {
            user.favBooks = user.favBooks.filter((bookId) => bId !== bookId);
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
    const bookId = req.body.bookId;
    try {
        const user: IUser = await User.findById(userId);
        if (user) {
            user.completedBooks.push(bookId);
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
        const error = new RequestError("Error in adding book to completed.", 400, err);
        next(error);
    }

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
                , "message": "Error in adding book to fav of user"
            });
        }
    } catch (err) {
        const error = new RequestError("Error in adding book to fav.", 400, err);
        next(error);
    }
};

export const updateInProgress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const userId = req.userData.userId;
    const newBookMark: BookMark = req.body.bookMark;
    const bookId = newBookMark.bookId;
    try {
        const user: IUser = await User.findById(userId);
        let foundBookMarkIndex = false;
        if (user) {
            for (let i = 0; i < user.inProgressBooks.length; i++) {
                if (user.inProgressBooks[i].bookId === bookId) {
                    user.inProgressBooks[i] = newBookMark;
                    foundBookMarkIndex = true;
                    break;
                }
            }
            if (!foundBookMarkIndex) {
                await res.json({
                    "status": "failed"
                    , "message": "BookId not in in-progress list."
                });
            }
            // As a user is reading the book, it's wise to keep it at 1st index for faster results.
            user.inProgressBooks.reverse();
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
                , "message": "Error in updating in-progress books of user"
            });
        }
    } catch (err) {
        const error = new RequestError("Error in adding book to fav.", 400, err);
        next(error);
    }
};

export const addToInProgress: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const userId = req.userData.userId;
    const bookMark: BookMark = req.body.bookMark;
    try {
        const user: IUser = await User.findById(userId);
        if (user) {
            user.inProgressBooks.push(bookMark);
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
        const error = new RequestError("Error in adding book to In-progress.", 400, err);
        next(error);
    }
};