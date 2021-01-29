"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const OrderSchema = new mongoose_1.default.Schema({
    items: [{ type: Object, ref: 'Item', required: true }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
    orderDate: { type: Date, required: true },
    totalRewardPrice: { type: Number, required: true }
});
OrderSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("Order", OrderSchema);
