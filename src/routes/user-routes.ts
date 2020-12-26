import * as express from 'express';
import {
    addRewardPoints,
    addToCart,
    editUser,
    getUserById,
    getUsers,
    removeFromCart,
    removeRewardPoints
} from '../controllers/user-controller.js'
import checkAuth from "../middlewares/check-auth";
import {check} from "express-validator";

const router = express.Router();

router.get('/get', getUsers);

router.get('/get/:id', getUserById);

router.patch('/patch/', checkAuth, editUser);

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


export default router;