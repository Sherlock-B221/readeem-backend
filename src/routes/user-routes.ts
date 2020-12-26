import * as express from 'express';
import {
    addRewardPoints,
    addToCart,
    addToCompleted,
    addToFav,
    addToInProgress,
    editUser,
    getUserById,
    getUserCart,
    getUserCompleted,
    getUserFav,
    getUserInProgress,
    getUsers,
    removeFromCart,
    removeFromFav,
    removeFromInProgress,
    removeRewardPoints,
    updateInProgress
} from '../controllers/user-controller.js'
import checkAuth from "../middlewares/check-auth";
import {check} from "express-validator";

const router = express.Router();

router.get('/get', getUsers);

router.get('/get/:id', getUserById);

router.get('/get/cart', checkAuth, getUserCart);

router.get('/get/fav', checkAuth, getUserFav);

router.get('/get/inProgress', checkAuth, getUserInProgress);

router.get('/get/completed', checkAuth, getUserCompleted);

router.patch('/patch', checkAuth, editUser);

router.patch('/patch/addPoints', [
    check('rewardPoints')
        .not().isEmpty(),
], checkAuth, addRewardPoints);

router.patch('/patch/reducePoints', [
    check('rewardPoints')
        .not().isEmpty(),
], checkAuth, removeRewardPoints);

router.patch('/patch/addToCart', [
    check('items')
        .not().isEmpty(),
], checkAuth, addToCart);

router.patch('/patch/removeFromCart', [
    check('items')
        .not().isEmpty(),
], checkAuth, removeFromCart);

router.patch('/patch/addToInProgress',
    [
        check('bookMark')
            .not()
            .isEmpty()
    ],
    checkAuth,
    addToInProgress);

router.patch('/patch/addToCompleted',
    [
        check('bookId')
            .not()
            .isEmpty()
    ],
    checkAuth,
    addToCompleted);

router.patch('/patch/addToFav',
    [
        check('bookId')
            .not()
            .isEmpty()
    ],
    checkAuth,
    addToFav);

router.patch('/patch/removeFromFav',
    [
        check('bookId')
            .not()
            .isEmpty()
    ],
    checkAuth,
    removeFromFav);

router.patch('/patch/removeFromInProgress',
    [
        check('bookId')
            .not()
            .isEmpty()
    ],
    checkAuth,
    removeFromInProgress);

router.patch('/patch/updateInProgress',
    [
        check('bookMark')
            .not()
            .isEmpty()
    ],
    checkAuth,
    updateInProgress);


export default router;