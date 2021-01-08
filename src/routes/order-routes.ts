import * as express from 'express';
import {check} from 'express-validator';
import checkAuth from "../middlewares/check-auth";
import {createOrder, getAllOrders, getOrderById, getUserOrders} from "../controllers/order-controller";
import checkSuperUser from "../middlewares/super-user";

const router = express.Router();
router.post('/post'
    , [
        check('items')
            .not()
            .isEmpty(),
        check('totalRewardPrice')
            .not()
            .isEmpty(),
    ]
    , checkAuth, createOrder
);

router.get('/get/', checkAuth, getUserOrders);

router.get('/get/all', checkSuperUser, getAllOrders);

router.get('/get/one/:id', checkAuth, getOrderById);

export default router;