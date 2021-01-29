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
const order_controller_1 = require("../controllers/order-controller");
const super_user_1 = __importDefault(require("../middlewares/super-user"));
const router = express.Router();
router.post('/post', [
    express_validator_1.check('items')
        .not()
        .isEmpty(),
    express_validator_1.check('totalRewardPrice')
        .not()
        .isEmpty(),
], check_auth_1.default, order_controller_1.createOrder);
router.get('/get/', check_auth_1.default, order_controller_1.getUserOrders);
router.get('/get/all', super_user_1.default, order_controller_1.getAllOrders);
router.get('/get/one/:id', check_auth_1.default, order_controller_1.getOrderById);
exports.default = router;
