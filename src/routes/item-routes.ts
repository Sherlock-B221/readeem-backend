import * as express from 'express';
import {check} from 'express-validator';
import checkAuth from "../middlewares/check-auth";
import {
        createItem,
        deleteItem,
        editItem,
        getAllItems,
        getItemById,
        getItemCouponCode, itemFullSearch, itemFuzzySearch
} from "../controllers/item-controller";
import checkSuperUser from "../middlewares/super-user";

const router = express.Router();

router.post('/post'
    , [
        check('name')
            .not().isEmpty(),
        check('description')
            .not().isEmpty(),
        check('price')
            .not().isEmpty(),
        check('discountedRewardPrice')
            .not().isEmpty(),
        check('tags')
            .not().isEmpty(),
        check('couponCode')
            .not().isEmpty(),
        check('sellerName')
            .not().isEmpty(),
        check('sellerNumber')
            .not().isEmpty(),
        check('sellerEmail')
            .isEmail(),
        check('categories')
            .not().isEmpty(),
    ]
    , checkAuth, checkSuperUser, createItem
);

router.get('/get/all', checkAuth, getAllItems);

router.get('/get/one/:id', checkAuth, getItemById);

router.get('/get/search',checkAuth,itemFullSearch);

router.get('/get/fuzzy',checkAuth,itemFuzzySearch);

router.get('/get/couponCode/:id',checkAuth,getItemCouponCode);

router.patch('/patch/:id', checkSuperUser, editItem);

router.delete('/delete/:id', checkSuperUser, deleteItem);

export default router;