"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const express_validator_1 = require("express-validator");
const check_auth_1 = __importDefault(require("../middlewares/check-auth"));
const item_controller_1 = require("../controllers/item-controller");
const super_user_1 = __importDefault(require("../middlewares/super-user"));
const single_file_upload_1 = require("../middlewares/single-file-upload");
const router = express.Router();
router.post('/post', [
    express_validator_1.check('name')
        .not().isEmpty(),
    express_validator_1.check('description')
        .not().isEmpty(),
    express_validator_1.check('price')
        .not().isEmpty(),
    express_validator_1.check('discountedRewardPrice')
        .not().isEmpty(),
    express_validator_1.check('tags')
        .not().isEmpty(),
    express_validator_1.check('couponCode')
        .not().isEmpty(),
    express_validator_1.check('sellerName')
        .not().isEmpty(),
    express_validator_1.check('sellerNumber')
        .not().isEmpty(),
    express_validator_1.check('sellerEmail')
        .isEmail(),
    express_validator_1.check('categories')
        .not().isEmpty(),
    single_file_upload_1.singleFileUpload('uploads/itemImages', 'itemImg')
], super_user_1.default, item_controller_1.createItem);
router.get('/get/all', check_auth_1.default, item_controller_1.getAllItems);
router.get('/get/one/:id', check_auth_1.default, item_controller_1.getItemById);
router.get('/get/search', check_auth_1.default, item_controller_1.itemFullSearch);
router.get('/get/fuzzy', check_auth_1.default, item_controller_1.itemFuzzySearch);
router.get('/get/couponCode/:id', check_auth_1.default, item_controller_1.getItemCouponCode);
router.patch('/patch/:id', [
    express_validator_1.check('name')
        .not().isEmpty(),
    express_validator_1.check('description')
        .not().isEmpty(),
    express_validator_1.check('price')
        .not().isEmpty(),
    express_validator_1.check('discountedRewardPrice')
        .not().isEmpty(),
    express_validator_1.check('tags')
        .not().isEmpty(),
    express_validator_1.check('couponCode')
        .not().isEmpty(),
    express_validator_1.check('sellerName')
        .not().isEmpty(),
    express_validator_1.check('sellerNumber')
        .not().isEmpty(),
    express_validator_1.check('sellerEmail')
        .isEmail(),
    express_validator_1.check('categories')
        .not().isEmpty(),
    single_file_upload_1.singleFileUpload('uploads/itemImages', 'itemImg')
], super_user_1.default, item_controller_1.editItem);
router.delete('/delete/:id', super_user_1.default, item_controller_1.deleteItem);
exports.default = router;
