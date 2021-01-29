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
const auth_controller_js_1 = require("../controllers/auth-controller.js");
const single_file_upload_1 = require("../middlewares/single-file-upload");
const check_auth_1 = __importDefault(require("../middlewares/check-auth"));
const router = express.Router();
router.post('/signUp', [
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
    express_validator_1.body('password').isLength({ min: 6 }),
    single_file_upload_1.singleFileUpload('uploads/images', 'img'),
], auth_controller_js_1.signUp);
router.post('/thirdParty', [
    express_validator_1.body('name')
        .not()
        .isEmpty(),
    express_validator_1.body('mobile')
        .not()
        .isEmpty(),
    express_validator_1.body('email')
        .normalizeEmail()
        .isEmail(),
    express_validator_1.body('img').not().isEmpty(),
], auth_controller_js_1.thirdPartyAuth);
router.post('/login', [
    express_validator_1.body('email')
        .not().isEmpty().normalizeEmail()
        .isEmail(),
    express_validator_1.body('password').isLength({ min: 6 }),
], auth_controller_js_1.login);
router.post('/forgotPassword', [
    express_validator_1.body('email')
        .not().isEmpty().normalizeEmail()
        .isEmail(),
], auth_controller_js_1.forgotPassword);
router.post('/changePassword', [
    express_validator_1.body('currentPassword').isLength({ min: 6 }),
    express_validator_1.body('newPassword').isLength({ min: 6 }),
], check_auth_1.default, auth_controller_js_1.changePassword);
router.post('/addPasswordUser', [
    express_validator_1.body('password').isLength({ min: 6 })
], check_auth_1.default, auth_controller_js_1.addPasswordToUser);
router.post('/resetPassword', [
    express_validator_1.body('newPassword').isLength({ min: 6 }),
], auth_controller_js_1.resetPassword);
router.get('/logout', check_auth_1.default, auth_controller_js_1.logout);
exports.default = router;
