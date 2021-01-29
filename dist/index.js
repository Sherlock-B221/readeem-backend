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
const mongoose_1 = __importDefault(require("mongoose"));
const fs = __importStar(require("fs"));
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const item_routes_1 = __importDefault(require("./routes/item-routes"));
const book_routes_1 = __importDefault(require("./routes/book-routes"));
const order_routes_1 = __importDefault(require("./routes/order-routes"));
// todo: Improvements:-
// todo: 1 encrypt tokens wen storing in dp
// todo: 2 maybe improve super-user
// todo: 4 try to use await Promise.all([user.save(), post.save()])
// todo: 5 use virtual for better code quality
// todo: 3 test thirdPartyAuth with the new BlurHash module.
// todo: 6 add isBlurHashValid to controllers that use blur hash before saving to db.
const request_error_1 = __importDefault(require("./middlewares/request-error"));
require('dotenv').config();
const app = express_1.default();
app.use(express_1.default.json());
//Routes
app.use('/api/ping', express_1.default.Router().get('/', async (req, res, next) => {
    await res.json({
        'status': 'success',
        'message': "Pinged!!!"
    });
}));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/order', order_routes_1.default);
app.use('/api/item', item_routes_1.default);
app.use('/api/book', book_routes_1.default);
app.use('/api/user', user_routes_1.default);
//Unsupported Routes
app.use((req, res, next) => {
    throw new request_error_1.default('Cannot find this Route!', 404);
});
//Error Handling for any other error
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        "status": "failed",
        "message": error.message || 'An unknown error occurred!'
    });
});
app.listen(process.env.PORT || process.env.SV_PORT, () => {
    console.log("Started server on Port", process.env.SV_PORT);
    mongoose_1.default
        .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
        .then(() => {
        console.log('Connected to db.');
    })
        .catch(err => {
        console.log(err);
    });
});
