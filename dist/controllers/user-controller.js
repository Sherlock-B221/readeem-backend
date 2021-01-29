"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToInProgress = exports.updateInProgress = exports.addToFav = exports.addToCompleted = exports.removeFromFav = exports.removeFromCart = exports.editProfile = exports.updateInCart = exports.addToCart = exports.getUserCart = exports.addRewardPoints = exports.getUserCompleted = exports.getUserInProgress = exports.getUserFav = exports.getUserById = exports.getUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const request_error_1 = __importDefault(require("../middlewares/request-error"));
const check_tokens_1 = require("../utils/check-tokens");
const validate_1 = require("../utils/validate");
const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await user_1.default.find().lean();
        await res.json({ "status": "success", users });
    }
    catch (err) {
        const error = new request_error_1.default("Error in fetching users.", 400);
        next(error);
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res, next) => {
    let user;
    try {
        const userId = req.params.id;
        user = await user_1.default.findById(userId).lean();
        if (user) {
            delete user.password;
            await res.json({
                "status": "success",
                "user": user
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
        console.log(err);
        const error = new request_error_1.default("Error in fetching user's profile.", 400);
        next(error);
    }
};
exports.getUserById = getUserById;
const getUserFav = async (req, res, next) => {
    let favBooks;
    try {
        const userId = req.userData.userId;
        favBooks = await user_1.default.findById(userId).select({ favBooks: 1 }).populate('favBooks').lean();
        if (favBooks) {
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "favBooks": favBooks,
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
        console.log(err);
        const error = new request_error_1.default("Error in fetching user's favBooks.", 400);
        next(error);
    }
};
exports.getUserFav = getUserFav;
const getUserInProgress = async (req, res, next) => {
    let inProgressBooks;
    try {
        const userId = req.userData.userId;
        inProgressBooks = await user_1.default.findById(userId).select({ inProgressBooks: 1 })
            .populate('inProgressBooks').lean();
        if (inProgressBooks) {
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "inProgressBooks": inProgressBooks,
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
        console.log(err);
        const error = new request_error_1.default("Error in fetching user's in progress.", 400);
        next(error);
    }
};
exports.getUserInProgress = getUserInProgress;
const getUserCompleted = async (req, res, next) => {
    let completedBooks;
    try {
        const userId = req.userData.userId;
        completedBooks = await user_1.default.findById(userId).select({ completedBooks: 1 }).lean();
        if (completedBooks) {
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "completedBooks": completedBooks,
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
exports.getUserCompleted = getUserCompleted;
const addRewardPoints = async (req, res, next) => {
    validate_1.validate(req, next);
    const rewardPoints = req.body.rewardPoints;
    const userId = req.userData.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (user) {
            user.reward += rewardPoints;
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
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
        const error = new request_error_1.default("Error in adding reward points.", 400, err);
        next(error);
    }
};
exports.addRewardPoints = addRewardPoints;
const getUserCart = async (req, res, next) => {
    let cartItems;
    try {
        const userId = req.userData.userId;
        cartItems = await user_1.default.findById(userId).select({ cart: 1 }).populate('cart').lean();
        if (cartItems) {
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "cartItems": cartItems,
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
exports.getUserCart = getUserCart;
const addToCart = async (req, res, next) => {
    validate_1.validate(req, next);
    const items = req.body.items;
    const userId = req.userData.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (user) {
            user.cart.push(items);
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
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
        const error = new request_error_1.default("Error in adding items to cart.", 400, err);
        next(error);
    }
};
exports.addToCart = addToCart;
const updateInCart = async (req, res, next) => {
    validate_1.validate(req, next);
    try {
        const { cartItem } = req.body;
        const { userId } = req.userData;
        const user = await user_1.default.findById(userId);
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
                    "status": "failed",
                    "message": "ItemId not in cart list."
                });
            }
            // As a user is confused about the quantity, it's wise to keep it at 1st index for faster results.
            user.cart.reverse();
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
                ...changedTokenPair
            });
        }
        else {
            await res.json({
                "status": "failed",
                "message": "Error in updating cart item of user"
            });
        }
    }
    catch (e) {
        const error = new request_error_1.default("Error in updating items in cart.", 400, e);
        next(error);
    }
};
exports.updateInCart = updateInCart;
const editProfile = async (req, res, next) => {
    //validation
    validate_1.validate(req, next);
    const { name, email, password, mobile, imgHash } = req.body;
    // if email is sent, then revoke thirdParty access.
    const userId = req.userData.userId;
    let existingUser;
    try {
        existingUser = await user_1.default.findById(userId);
    }
    catch (err) {
        const error = new request_error_1.default("Error querying database", 500, err);
        return next(error);
    }
    if (!existingUser) {
        const error = new request_error_1.default("User doesn't exist.", 500);
        return next(error);
    }
    try {
        let filePath;
        if (req.file) {
            filePath = req.file.path;
        }
        else {
            filePath = 'uploads/images/DUser.png';
        }
        filePath = 'https://win75.herokuapp.com/' + filePath;
        //TODO: change url
    }
    catch (err) {
        const error = new request_error_1.default("Error in editing user.", 500, err);
        return next(error);
    }
};
exports.editProfile = editProfile;
const removeFromCart = async (req, res, next) => {
    validate_1.validate(req, next);
    const itemsToBeRemoved = req.body.items;
    const userId = req.userData.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (user) {
            user.cart = user.cart.filter((item) => !itemsToBeRemoved.includes(item._id));
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
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
        const error = new request_error_1.default("Error in adding removing item from cart.", 400, err);
        next(error);
    }
};
exports.removeFromCart = removeFromCart;
const removeFromFav = async (req, res, next) => {
    validate_1.validate(req, next);
    const bId = req.body.bookId;
    const userId = req.userData.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (user) {
            user.favBooks = user.favBooks.filter((bookId) => bId !== bookId);
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
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
        const error = new request_error_1.default("Error in removing book from fav.", 400, err);
        next(error);
    }
};
exports.removeFromFav = removeFromFav;
const addToCompleted = async (req, res, next) => {
    validate_1.validate(req, next);
    const userId = req.userData.userId;
    const bookId = req.body.bookId;
    try {
        const user = await user_1.default.findById(userId);
        if (user) {
            user.completedBooks.push(bookId);
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
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
        const error = new request_error_1.default("Error in adding book to completed.", 400, err);
        next(error);
    }
};
exports.addToCompleted = addToCompleted;
const addToFav = async (req, res, next) => {
    validate_1.validate(req, next);
    const userId = req.userData.userId;
    const bookId = req.body.bookId;
    try {
        const user = await user_1.default.findById(userId);
        if (user) {
            user.favBooks.push(bookId);
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
                ...changedTokenPair
            });
        }
        else {
            await res.json({
                "status": "failed",
                "message": "Error in adding book to fav of user"
            });
        }
    }
    catch (err) {
        const error = new request_error_1.default("Error in adding book to fav.", 400, err);
        next(error);
    }
};
exports.addToFav = addToFav;
const updateInProgress = async (req, res, next) => {
    validate_1.validate(req, next);
    const userId = req.userData.userId;
    const newBookMark = req.body.bookMark;
    const bookId = newBookMark.bookId;
    try {
        const user = await user_1.default.findById(userId);
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
                    "status": "failed",
                    "message": "BookId not in in-progress list."
                });
            }
            // As a user is reading the book, it's wise to keep it at 1st index for faster results.
            user.inProgressBooks.reverse();
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
                ...changedTokenPair
            });
        }
        else {
            await res.json({
                "status": "failed",
                "message": "Error in updating in-progress books of user"
            });
        }
    }
    catch (err) {
        const error = new request_error_1.default("Error in adding book to fav.", 400, err);
        next(error);
    }
};
exports.updateInProgress = updateInProgress;
const addToInProgress = async (req, res, next) => {
    validate_1.validate(req, next);
    const userId = req.userData.userId;
    const bookMark = req.body.bookMark;
    try {
        const user = await user_1.default.findById(userId);
        if (user) {
            user.inProgressBooks.push(bookMark);
            await user.save();
            const changedTokenPair = check_tokens_1.checkTokens(req.isAccessTokenValid, req.refreshToken, req.accessToken);
            await res.json({
                "status": "success",
                "user": user,
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
        const error = new request_error_1.default("Error in adding book to In-progress.", 400, err);
        next(error);
    }
};
exports.addToInProgress = addToInProgress;
