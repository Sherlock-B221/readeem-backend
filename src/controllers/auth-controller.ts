import bcrypt from "bcrypt";
import {NextFunction, Request, Response} from 'express';
import RefreshRevoked from '../models/refresh-revoke';
import jwt from 'jsonwebtoken';
import AccessBlackList from '../models/access-blacklist';

import User from '../models/user';
import RequestError from "../middlewares/request-error";
import {validate} from "../utils/validate";
import {sendMail} from "../utils/send-mail";
import {getTokens} from "../utils/get-tokens";
import {encodeImageToBlurhash} from "../utils/blurhash-utils";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    //validation
    validate(req, next);
    const {name, email, password, mobile, imgHash} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);
        return next(error);
    }

    if (existingUser) {
        const error = new RequestError('User exists already, please login instead.', 422);
        return next(error);
    }
    let hashedPassword = '';
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new RequestError('Could not create user, please try again.', 500, err);
        return next(error);
    }
    const joinDateString = Date().toLocaleString();
    const joinDateObj = new Date(Date.parse(joinDateString));
    let filePath;
    try {
        if (req.file) {
            filePath = req.file.path;
        } else {
            filePath = 'uploads/images/DUser.png';
        }
    } catch (err) {
        console.log(err);
        const error = new RequestError(err.message, err.code, err);
        return next(error);
    }
    filePath = 'https://win75.herokuapp.com/' + filePath;
//TODO: change url
    const createdUser = new User({
        name,
        email,
        mobile,
        // if image is not sent, default hash would be sent
        imgHash,
        isThirdParty: false,
        isBoth: false,
        joinDate:joinDateObj,
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
    } catch (err) {
        const error = new RequestError("Error creating user", 500, err);
        return next(error);
    }

    try {
        const {refreshToken, accessToken} = getTokens(createdUser.id, createdUser.email, createdUser.changePasswordDate);
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
    } catch (e) {
        const error = new RequestError('An error occurred, please try again later.', 422);
        return next(error);
    }

};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const {email, password} = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new RequestError(
            err.message,
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new RequestError(
            'You are not registered!!!',
            403
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new RequestError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new RequestError(
            'Incorrect password entered.',
            403
        );
        return next(error);
    }

    try {
        const {refreshToken, accessToken} = getTokens(existingUser.id, existingUser.email, existingUser.changePasswordDate);
        const existingUserObj = existingUser.toObject();
        delete existingUserObj.password;
        await res.json({
            "status": "success",
            "user": existingUserObj,
            refreshToken: refreshToken,
            accessToken: accessToken
        });
    } catch (e) {
        const error = new RequestError('An error occurred, please try again later.', 422);
        return next(error);
    }
};

export const thirdPartyAuth = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const {name, email, mobile, img} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);
        return next(error);
    }

    if (existingUser) {
        if (existingUser.isThirdParty) {
            try {
                const {refreshToken, accessToken} = getTokens(existingUser.id, existingUser.email, existingUser.changePasswordDate);
                const existingUserObj = existingUser.toObject();
                delete existingUserObj.password;
                await res.json({
                    "status": "success",
                    "user": existingUserObj,
                    refreshToken: refreshToken,
                    accessToken: accessToken
                });
            } catch (e) {
                const error = new RequestError('An error occurred, please try again later.', 422);
                return next(error);
            }

        }
        const error = new RequestError('Account created using email or email was changed in previous session, please login using email instead.', 422);
        return next(error);
    }
    const joinDateString = Date().toLocaleString();
    const joinDateObj = new Date(Date.parse(joinDateString));
    let imgHash;
    if(img){
        imgHash = await encodeImageToBlurhash(img)
    }
    const createdUser = new User({
        name,
        email,
        mobile,
        img,
        isThirdParty: true,
        isBoth: false,
        joinDate:joinDateObj,
        password: "",
        completedBooks: [],
        inProgressBooks: [],
        favBooks: [],
        changePasswordDate: joinDateObj,
        cart: [],
        reward: 0,
        previousOrders: [],
    });
    if(imgHash){
        createdUser.imgHash = imgHash;
    }
    try {
        await createdUser.save();
    } catch (err) {
        const error = new RequestError("Error creating user", 500, err);
        return next(error);
    }
    const {refreshToken, accessToken} = getTokens(createdUser.id, createdUser.email, createdUser.changePasswordDate);
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

export const addPasswordToUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userData.userId;
    let user;
    try {
        user = await User.findById(userId)
    } catch (err) {
        const error = new RequestError("Something went wrong can't get user.", 500);
        return next(error);
    }
    if (!user) {
        const error = new RequestError("Can't find user for provided id", 404);
        return next(error);
    }
    validate(req, next);
    const {password} = req.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new RequestError(
            'Could not add password, please try again.',
            500
        );
        return next(error);
    }
    user.password = hashedPassword;
    user.changePasswordDate = new Date();
    user.isBoth = true;
    try {
        await user.save();
    } catch (err) {
        const error = new RequestError("Error saving user, try again later.", err.status);
        return next(error);
    }
    const authState: { accessToken?: string, refreshToken?: string } = req.isAccessTokenValid ? {} : {
        "accessToken": req.accessToken,
        "refreshToken": req.refreshToken
    };
    res.status(200).json({"status": "success", user, ...authState});
};

//todo: fix nodemailer
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const {email} = req.body;
    let user;
    try {
        user = await User.findOne({
            email
        });
    } catch (err) {
        const error = new RequestError("Something went wrong, please try again later.", err.status);
        return next(error);
    }
    if (!user) {
        const error = new RequestError(
            'You are not registered!!!',
            403
        );
        return next(error);
    }
    let token;
    try {
        token = jwt.sign(
            {
                email: email,
            },
            process.env.FORGET_PASSWORD_TOKEN_KEY, {
                expiresIn: '5m'
            }
        );
    } catch (err) {
        const error = new RequestError(
            'Reset password flow failed, try again later!!!',
            403
        );
        return next(error);
    }
    token = 'http://localhost:3000/forget-password/' + token;
    console.log(token);
    try {
        await sendMail(token, email, next);
    } catch (err) {
        const error = new RequestError(
            'Error in sending mail!!!',
            500
        );
        return next(error);
    }
    res.status(200).json({
        "status": "success",
        message: "Reset Link Sent"
    });
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userData.userId;
    const email = req.userData.email;
    let user;
    try {
        user = await User.findById(userId)
    } catch (err) {
        const error = new RequestError("Something went wrong can't get user.", 500);
        return next(error);
    }
    if (!user) {
        const error = new RequestError("Can't find user for provided id", 404);
        return next(error);
    }
    validate(req, next);
    const {newPassword, currentPassword} = req.body;
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(currentPassword, user.password);
    } catch (err) {
        const error = new RequestError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new RequestError(
            'Wrong Password!!',
            403
        );
        return next(error);
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
        const error = new RequestError(
            'Could not update password, please try again.',
            500
        );
        return next(error);
    }
    user.password = hashedPassword;
    user.changePasswordDate = new Date();
    try {
        await user.save();
    } catch (err) {
        const error = new RequestError("Error saving user, try again later.", err.status);
        return next(error);
    }
    try {
        await RefreshRevoked.create({refreshToken: req.refreshToken});
        await AccessBlackList.create({accessToken: req.accessToken});

    } catch (err) {
        const error = new RequestError("Error in changing password, try again later.", err.status);
        return next(error);
    }
    try {
        const {refreshToken, accessToken} = getTokens(userId, email, user.changePasswordDate);
        res.status(200).json({
            "status": "success",
            message: "Password updated",
            refreshToken: refreshToken,
            accessToken: accessToken
        });
    } catch (e) {
        const error = new RequestError('An error occurred, please try again later.', 422);
        return next(error);
    }
};

// this is used after forgot password, when the user submits the form.
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    try {
        token = jwt.verify(req.body.token, process.env.FORGET_PASSWORD_TOKEN_KEY);
    } catch (e) {
        const error = new RequestError(
            'Link Expired!!!',
            401
        );
        return next(error);
    }
    let user;
    try {
        // this token is not of type decoded token, refer forgotPassword
        user = await User.findOne({email: (token as { email: string }).email})
    } catch (err) {
        const error = new RequestError("Something went wrong can't get user.", 500);
        return next(error);
    }
    if (!user) {
        const error = new RequestError("Can't find user for provided id", 404);
        return next(error);
    }
    validate(req, next);
    const {newPassword} = req.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
        const error = new RequestError(
            'Could not reset password, please try again.',
            500
        );
        return next(error);
    }
    user.password = hashedPassword;
    user.changePasswordDate = new Date();
    try {
        await user.save();
    } catch (err) {
        const error = new RequestError("Error saving user, try again later.", err.status);
        return next(error);
    }
    res.status(200).json({
        "status": "success",
        message: "Password Reset Successful!!!",
    });
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await RefreshRevoked.create({refreshToken: req.refreshToken});
        await AccessBlackList.create({accessToken: req.accessToken});

    } catch (err) {
        console.log(err);
        const error = new RequestError("Error in Logging out, try again later.", err.status);
        return next(error);
    }
    res.status(200).json({
        "status": "success",
        message: "Logged Out",
    });
};