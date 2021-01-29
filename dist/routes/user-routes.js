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
const user_controller_js_1 = require("../controllers/user-controller.js");
const check_auth_1 = __importDefault(require("../middlewares/check-auth"));
const express_validator_1 = require("express-validator");
const single_file_upload_1 = require("../middlewares/single-file-upload");
const router = express.Router();
router.get('/get', user_controller_js_1.getUsers);
router.get('/get/user/:id', user_controller_js_1.getUserById);
router.get('/get/cart', check_auth_1.default, user_controller_js_1.getUserCart);
router.get('/get/fav', check_auth_1.default, user_controller_js_1.getUserFav);
router.get('/get/inProgress', check_auth_1.default, user_controller_js_1.getUserInProgress);
router.get('/get/completed', check_auth_1.default, user_controller_js_1.getUserCompleted);
router.patch('/patch', [
    express_validator_1.body('name')
        .not()
        .isEmpty(),
    express_validator_1.body('mobile')
        .not()
        .isEmpty(),
    express_validator_1.body('imgHash').not().isEmpty(),
    express_validator_1.body('email')
        .normalizeEmail()
        .isEmail(),
    single_file_upload_1.singleFileUpload('uploads/images', 'img'),
], check_auth_1.default, user_controller_js_1.editProfile);
router.patch('/patch/addPoints', [
    express_validator_1.check('rewardPoints')
        .not().isEmpty(),
], check_auth_1.default, user_controller_js_1.addRewardPoints);
router.patch('/patch/', [
    express_validator_1.check('cartItem')
        .not().isEmpty()
], user_controller_js_1.updateInCart);
router.patch('/patch/addToCart', [
    express_validator_1.check('items')
        .not().isEmpty(),
], check_auth_1.default, user_controller_js_1.addToCart);
router.patch('/patch/removeFromCart', [
    express_validator_1.check('items')
        .not().isEmpty(),
], check_auth_1.default, user_controller_js_1.removeFromCart);
router.patch('/patch/addToInProgress', [
    express_validator_1.check('bookMark')
        .not()
        .isEmpty()
], check_auth_1.default, user_controller_js_1.addToInProgress);
router.patch('/patch/addToCompleted', [
    express_validator_1.check('bookId')
        .not()
        .isEmpty()
], check_auth_1.default, user_controller_js_1.addToCompleted);
router.patch('/patch/addToFav', [
    express_validator_1.check('bookId')
        .not()
        .isEmpty()
], check_auth_1.default, user_controller_js_1.addToFav);
router.patch('/patch/removeFromFav', [
    express_validator_1.check('bookId')
        .not()
        .isEmpty()
], check_auth_1.default, user_controller_js_1.removeFromFav);
router.patch('/patch/updateInProgress', [
    express_validator_1.check('bookMark')
        .not()
        .isEmpty()
], check_auth_1.default, user_controller_js_1.updateInProgress);
exports.default = router;
