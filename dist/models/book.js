"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const BookSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    ratings: { type: Number, required: false },
    categories: [{ type: String, required: true }],
    keywords: [{ type: String, required: true }],
    publishedDate: { type: Date, required: true },
    bookUrl: { type: String, required: true },
    rewardPoints: { type: String, required: true },
    author: { type: String, required: true },
    cover: {
        type: String,
        default: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    }
});
BookSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("Book", BookSchema);
