import bcrypt from "bcrypt";
import {NextFunction, Request, Response} from 'express';
import RefreshRevoked from '../models/refresh_revoke';
import jwt from 'jsonwebtoken';
import AccessBlackList from '../models/access_blacklist';

import User from '../models/user';
import RequestError from "../middlewares/request-error";
import {validate} from "../utils/validate";
// signUp
const signUp = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const {name, email, password, mobile} = req.body;
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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new RequestError('Could not create user, please try again.', 500, err);
        return next(error);
    }
    const joinDate = Date().toLocaleString();

    let filePath;
    try {
        if (req.file) {
            filePath = req.file.path;
        } else {
            filePath = 'uploads/images/DUser.png'
        }
    } catch (err) {
        console.log(err);
        const error = new RequestError(err.message, err.code, err);
        return next(error);
    }
//TODO: change url
    const createdUser = new User({
        name,
        email,
        mobile,
        joinDate,
        img: 'https://win75.herokuapp.com/' + filePath,
        password: hashedPassword,
        completedBooks: [],
        inProgressBooks: [],
        favBooks: [],
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

    let accessToken, refreshToken;
    try {
        accessToken = jwt.sign(
            {userId: createdUser.id, email: createdUser.email},
            process.env.ACCESS_TOKEN_KEY, {
                expiresIn: '6hr'
            }
        );
        refreshToken = jwt.sign(
            {userId: createdUser.id, email: createdUser.email},
            process.env.REFRESH_TOKEN_KEY, {
                expiresIn: '30d'
            }
        );
    } catch (err) {
        const error = new RequestError('Signing up failed, please try again later.', 500, err);
        return next(error);
    }

    // Delete password from local createdUser variable to avoid sending it to the User.
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

// login
const login = async (req: Request, res: Response, next: NextFunction) => {
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

    let accessToken, refreshToken;
    try {
        accessToken = jwt.sign(
            {userId: existingUser.id, email: existingUser.email},
            process.env.ACCESS_TOKEN_KEY, {
                expiresIn: '6hr'
            }
        );
        refreshToken = jwt.sign(
            {userId: existingUser.id, email: existingUser.email},
            process.env.REFRESH_TOKEN_KEY, {
                expiresIn: '30d'
            }
        );
    } catch (err) {
        const error = new RequestError('Logging in failed, please try again later.', 500, err);
        return next(error);
    }
    const existingUserObj = existingUser.toObject();
    delete existingUserObj.password;
    await res.json({
        "status": "success",
        "user": existingUserObj,
        refreshToken: refreshToken,
        accessToken: accessToken
    });
};

// //todo: fix nodemailer
// const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
//     validate(req, next);
//     const email = req.body.email;
//     console.log(email);
//     let password = Math.random().toString().substring(0, 3) + Math.random().toString().slice(0, 3) + 'hult';
//     let user;
//     try {
//         user = await User.findOne({
//             email
//         });
//     } catch (err) {
//         const error = new RequestError("Something went wrong, please try again later.", err.status);
//         return next(error);
//     }
//     if (!user) {
//         const error = new RequestError(
//             'You are not registered!!!',
//             403
//         );
//         return next(error);
//     }
//     try {
//         await sendMail(password, email);
//     } catch (err) {
//         const error = new RequestError(
//             'Error in sending mail!!!',
//             500
//         );
//         return next(error);
//     }
//
//     let hashedPassword;
//     try {
//         hashedPassword = await bcrypt.hash(password, 12);
//     } catch (err) {
//         const error = new RequestError(
//             'Could not create user, please try again.',
//             500
//         );
//         return next(error);
//     }
//     user.password = hashedPassword;
//     try {
//         await user.save();
//     } catch (err) {
//         const error = new RequestError("Error saving user, try again later.", err.status);
//         return next(error);
//     }
//     res.status(200).json({
//         message: "Password updated"
//     });
// };

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userData.userId;
    const email = req.userData.email;
    console.log(userId);
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
    let accessToken, refreshToken;
    try {
        accessToken = jwt.sign(
            {userId: userId, email: email},
            process.env.ACCESS_TOKEN_KEY, {
                expiresIn: '6hr'
            }
        );
        refreshToken = jwt.sign(
            {userId: userId, email: email},
            process.env.REFRESH_TOKEN_KEY, {
                expiresIn: '30d'
            }
        );
    } catch (err) {
        const error = new RequestError('Signing up failed, please try again later.', 500, err);
        return next(error);
    }
    res.status(200).json({
        "status": "success",
        message: "Password updated",
        refreshToken: refreshToken,
        accessToken: accessToken
    });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await RefreshRevoked.create({refreshToken: req.refreshToken});
        await AccessBlackList.create({accessToken: req.accessToken});

    } catch (err) {
        const error = new RequestError("Error in changing password, try again later.", err.status);
        return next(error);
    }
    res.status(200).json({
        "status": "success",
        message: "Logged Out",
    });
};

exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;
exports.signUp = signUp;
exports.login = login;
exports.logout = logout;
