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
const super_user_1 = __importDefault(require("../middlewares/super-user"));
const book_controllers_1 = require("../controllers/book-controllers");
const single_file_upload_1 = require("../middlewares/single-file-upload");
const router = express.Router();
// todo: use multer for file upload
router.post('/post', [
    express_validator_1.check('title')
        .not().isEmpty(),
    express_validator_1.check('categories')
        .not().isEmpty(),
    express_validator_1.check('keywords')
        .not().isEmpty(),
    express_validator_1.check('publishedDate')
        .not().isEmpty(),
    express_validator_1.check('author')
        .not().isEmpty(),
    express_validator_1.check('bookUrl')
        .not().isEmpty(),
    express_validator_1.check('rewardPoints')
        .not().isEmpty(),
    single_file_upload_1.singleFileUpload('uploads/bookCovers', 'cover'),
], super_user_1.default, book_controllers_1.createBook);
router.get('/get/all', check_auth_1.default, book_controllers_1.getAllBooks);
router.get('/get/one/:id', check_auth_1.default, book_controllers_1.getBookById);
router.patch('/patch/:id', [
    express_validator_1.check('title')
        .not().isEmpty(),
    express_validator_1.check('categories')
        .not().isEmpty(),
    express_validator_1.check('keywords')
        .not().isEmpty(),
    express_validator_1.check('publishedDate')
        .not().isEmpty(),
    express_validator_1.check('author')
        .not().isEmpty(),
    express_validator_1.check('bookUrl')
        .not().isEmpty(),
    express_validator_1.check('rewardPoints')
        .not().isEmpty(),
], super_user_1.default, book_controllers_1.editBook);
router.delete('/delete/:id', super_user_1.default, book_controllers_1.deleteBook);
exports.default = router;
