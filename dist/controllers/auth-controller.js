"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPassword = exports.changePassword = exports.forgotPassword = exports.addPasswordToUser = exports.thirdPartyAuth = exports.login = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const refresh_revoke_1 = __importDefault(require("../models/refresh-revoke"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const access_blacklist_1 = __importDefault(require("../models/access-blacklist"));
const user_1 = __importDefault(require("../models/user"));
const request_error_1 = __importDefault(require("../middlewares/request-error"));
const validate_1 = require("../utils/validate");
const send_mail_1 = require("../utils/send-mail");
const get_tokens_1 = require("../utils/get-tokens");
const blurhash_utils_1 = require("../utils/blurhash-utils");
const signUp = async (req, res, next) => {
    //validation
    validate_1.validate(req, next);
    const { name, email, password, mobile, imgHash } = req.body;
    let existingUser;
    try {
        existingUser = await user_1.default.findOne({ email: email });
    }
    catch (err) {
        const error = new request_error_1.default("Error querying database", 500, err);
        return next(error);
    }
    if (existingUser) {
        const error = new request_error_1.default('User exists already, please login instead.', 422);
        return next(error);
    }
    let hashedPassword = '';
    try {
        hashedPassword = await bcrypt_1.default.hash(password, 12);
    }
    catch (err) {
        const error = new request_error_1.default('Could not create user, please try again.', 500, err);
        return next(error);
    }
    const joinDateString = Date().toLocaleString();
    const joinDateObj = new Date(Date.parse(joinDateString));
    let filePath;
    try {
        if (req.file) {
            filePath = req.file.path;
        }
        else {
            filePath = 'uploads/images/DUser.png';
        }
    }
    catch (err) {
        console.log(err);
        const error = new request_error_1.default(err.message, err.code, err);
        return next(error);
    }
    filePath = 'https://win75.herokuapp.com/' + filePath;
    //TODO: change url
    const createdUser = new user_1.default({
        name,
        email,
        mobile,
        // if image is not sent, default hash would be sent
        imgHash,
        isThirdParty: false,
        isBoth: false,
        joinDate: joinDateObj,
        img: filePath,
        password: hashedPassword,
        completedBooks: [],
        inProgressBooks: [],
        favBooks: [],
        changePasswordDate: joinDateObj,
        cart: [],
        reward: 0,
        previousOrders: [],
    });
    try {
        await createdUser.save();
    }
    catch (err) {
        const error = new request_error_1.default("Error creating user", 500, err);
        return next(error);
    }
    try {
        const { refreshToken, accessToken } = get_tokens_1.getTokens(createdUser.id, createdUser.email, createdUser.changePasswordDate);
        let createdUserObj = createdUser.toObject();
        delete createdUserObj.password;
        await res
            .status(201)
            .json({
            "status": "success",
            user: createdUserObj,
            refreshToken: refreshToken,
            accessToken: accessToken
        });
    }
    catch (e) {
        const error = new request_error_1.default('An error occurred, please try again later.', 422);
        return next(error);
    }
};
exports.signUp = signUp;
const login = async (req, res, next) => {
    validate_1.validate(req, next);
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await user_1.default.findOne({ email: email });
    }
    catch (err) {
        const error = new request_error_1.default(err.message, 500);
        return next(error);
    }
    if (!existingUser) {
        const error = new request_error_1.default('You are not registered!!!', 403);
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt_1.default.compare(password, existingUser.password);
    }
    catch (err) {
        const error = new request_error_1.default('Could not log you in, please check your credentials and try again.', 500);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new request_error_1.default('Incorrect password entered.', 403);
        return next(error);
    }
    try {
        const { refreshToken, accessToken } = get_tokens_1.getTokens(existingUser.id, existingUser.email, existingUser.changePasswordDate);
        const existingUserObj = existingUser.toObject();
        delete existingUserObj.password;
        await res.json({
            "status": "success",
            "user": existingUserObj,
            refreshToken: refreshToken,
            accessToken: accessToken
        });
    }
    catch (e) {
        const error = new request_error_1.default('An error occurred, please try again later.', 422);
        return next(error);
    }
};
exports.login = login;
const thirdPartyAuth = async (req, res, next) => {
    validate_1.validate(req, next);
    const { name, email, mobile, img } = req.body;
    let existingUser;
    try {
        existingUser = await user_1.default.findOne({ email: email });
    }
    catch (err) {
        const error = new request_error_1.default("Error querying database", 500, err);
        return next(error);
    }
    if (existingUser) {
        if (existingUser.isThirdParty) {
            try {
                const { refreshToken, accessToken } = get_tokens_1.getTokens(existingUser.id, existingUser.email, existingUser.changePasswordDate);
                const existingUserObj = existingUser.toObject();
                delete existingUserObj.password;
                await res.json({
                    "status": "success",
                    "user": existingUserObj,
                    refreshToken: refreshToken,
                    accessToken: accessToken
                });
            }
            catch (e) {
                const error = new request_error_1.default('An error occurred, please try again later.', 422);
                return next(error);
            }
        }
        const error = new request_error_1.default('Account created using email or email was changed in previous session, please login using email instead.', 422);
        return next(error);
    }
    const joinDateString = Date().toLocaleString();
    const joinDateObj = new Date(Date.parse(joinDateString));
    let imgHash;
    if (img) {
        imgHash = await blurhash_utils_1.encodeImageToBlurhash(img);
    }
    const createdUser = new user_1.default({
        name,
        email,
        mobile,
        img,
        isThirdParty: true,
        isBoth: false,
        joinDate: joinDateObj,
        password: "",
        completedBooks: [],
        inProgressBooks: [],
        favBooks: [],
        changePasswordDate: joinDateObj,
        cart: [],
        reward: 0,
        previousOrders: [],
    });
    if (imgHash) {
        createdUser.imgHash = imgHash;
    }
    try {
        await createdUser.save();
    }
    catch (err) {
        const error = new request_error_1.default("Error creating user", 500, err);
        return next(error);
    }
    const { refreshToken, accessToken } = get_tokens_1.getTokens(createdUser.id, createdUser.email, createdUser.changePasswordDate);
    let createdUserObj = createdUser.toObject();
    delete createdUserObj.password;
    await res
        .status(201)
        .json({
        "status": "success",
        user: createdUserObj,
        refreshToken: refreshToken,
        accessToken: accessToken
    });
};
exports.thirdPartyAuth = thirdPartyAuth;
const addPasswordToUser = async (req, res, next) => {
    const userId = req.userData.userId;
    let user;
    try {
        user = await user_1.default.findById(userId);
    }
    catch (err) {
        const error = new request_error_1.default("Something went wrong can't get user.", 500);
        return next(error);
    }
    if (!user) {
        const error = new request_error_1.default("Can't find user for provided id", 404);
        return next(error);
    }
    validate_1.validate(req, next);
    const { password } = req.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt_1.default.hash(password, 12);
    }
    catch (err) {
        const error = new request_error_1.default('Could not add password, please try again.', 500);
        return next(error);
    }
    user.password = hashedPassword;
    user.changePasswordDate = new Date();
    user.isBoth = true;
    try {
        await user.save();
    }
    catch (err) {
        const error = new request_error_1.default("Error saving user, try again later.", err.status);
        return next(error);
    }
    const authState = req.isAccessTokenValid ? {} : {
        "accessToken": req.accessToken,
        "refreshToken": req.refreshToken
    };
    res.status(200).json({ "status": "success", user, ...authState });
};
exports.addPasswordToUser = addPasswordToUser;
//todo: fix nodemailer
const forgotPassword = async (req, res, next) => {
    validate_1.validate(req, next);
    const { email } = req.body;
    let user;
    try {
        user = await user_1.default.findOne({
            email
        });
    }
    catch (err) {
        const error = new request_error_1.default("Something went wrong, please try again later.", err.status);
        return next(error);
    }
    if (!user) {
        const error = new request_error_1.default('You are not registered!!!', 403);
        return next(error);
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({
            email: email,
        }, process.env.FORGET_PASSWORD_TOKEN_KEY, {
            expiresIn: '5m'
        });
    }
    catch (err) {
        const error = new request_error_1.default('Reset password flow failed, try again later!!!', 403);
        return next(error);
    }
    token = 'http://localhost:3000/forget-password/' + token;
    console.log(token);
    try {
        await send_mail_1.sendMail(token, email, next);
    }
    catch (err) {
        const error = new request_error_1.default('Error in sending mail!!!', 500);
        return next(error);
    }
    res.status(200).json({
        "status": "success",
        message: "Reset Link Sent"
    });
};
exports.forgotPassword = forgotPassword;
const changePassword = async (req, res, next) => {
    const userId = req.userData.userId;
    const email = req.userData.email;
    let user;
    try {
        user = await user_1.default.findById(userId);
    }
    catch (err) {
        const error = new request_error_1.default("Something went wrong can't get user.", 500);
        return next(error);
    }
    if (!user) {
        const error = new request_error_1.default("Can't find user for provided id", 404);
        return next(error);
    }
    validate_1.validate(req, next);
    const { newPassword, currentPassword } = req.body;
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt_1.default.compare(currentPassword, user.password);
    }
    catch (err) {
        const error = new request_error_1.default('Could not log you in, please check your credentials and try again.', 500);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new request_error_1.default('Wrong Password!!', 403);
        return next(error);
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt_1.default.hash(newPassword, 12);
    }
    catch (err) {
        const error = new request_error_1.default('Could not update password, please try again.', 500);
        return next(error);
    }
    user.password = hashedPassword;
    user.changePasswordDate = new Date();
    try {
        await user.save();
    }
    catch (err) {
        const error = new request_error_1.default("Error saving user, try again later.", err.status);
        return next(error);
    }
    try {
        await refresh_revoke_1.default.create({ refreshToken: req.refreshToken });
        await access_blacklist_1.default.create({ accessToken: req.accessToken });
    }
    catch (err) {
        const error = new request_error_1.default("Error in changing password, try again later.", err.status);
        return next(error);
    }
    try {
        const { refreshToken, accessToken } = get_tokens_1.getTokens(userId, email, user.changePasswordDate);
        res.status(200).json({
            "status": "success",
            message: "Password updated",
            refreshToken: refreshToken,
            accessToken: accessToken
        });
    }
    catch (e) {
        const error = new request_error_1.default('An error occurred, please try again later.', 422);
        return next(error);
    }
};
exports.changePassword = changePassword;
// this is used after forgot password, when the user submits the form.
const resetPassword = async (req, res, next) => {
    let token;
    try {
        token = jsonwebtoken_1.default.verify(req.body.token, process.env.FORGET_PASSWORD_TOKEN_KEY);
    }
    catch (e) {
        const error = new request_error_1.default('Link Expired!!!', 401);
        return next(error);
    }
    let user;
    try {
        // this token is not of type decoded token, refer forgotPassword
        user = await user_1.default.findOne({ email: token.email });
    }
    catch (err) {
        const error = new request_error_1.default("Something went wrong can't get user.", 500);
        return next(error);
    }
    if (!user) {
        const error = new request_error_1.default("Can't find user for provided id", 404);
        return next(error);
    }
    validate_1.validate(req, next);
    const { newPassword } = req.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt_1.default.hash(newPassword, 12);
    }
    catch (err) {
        const error = new request_error_1.default('Could not reset password, please try again.', 500);
        return next(error);
    }
    user.password = hashedPassword;
    user.changePasswordDate = new Date();
    try {
        await user.save();
    }
    catch (err) {
        const error = new request_error_1.default("Error saving user, try again later.", err.status);
        return next(error);
    }
    res.status(200).json({
        "status": "success",
        message: "Password Reset Successful!!!",
    });
};
exports.resetPassword = resetPassword;
const logout = async (req, res, next) => {
    try {
        await refresh_revoke_1.default.create({ refreshToken: req.refreshToken });
        await access_blacklist_1.default.create({ accessToken: req.accessToken });
    }
    catch (err) {
        console.log(err);
        const error = new request_error_1.default("Error in Logging out, try again later.", err.status);
        return next(error);
    }
    res.status(200).json({
        "status": "success",
        message: "Logged Out",
    });
};
exports.logout = logout;
