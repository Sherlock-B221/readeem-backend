"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const ItemSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedRewardPrice: { type: Number, required: true },
    tags: [{ type: String, required: true }],
    // it is to be stored in encryption
    couponCode: { type: String, required: true },
    //
    itemImg: { type: String, required: true },
    sellerName: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    sellerNumber: { type: String, required: true },
    categories: [{ type: String, required: true }],
});
ItemSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("Item", ItemSchema);
