"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    completedBooks: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Book' }],
    inProgressBooks: [{ type: Object, ref: 'Book' }],
    favBooks: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Book' }],
    joinDate: { type: Date, required: true },
    changePasswordDate: { type: Date },
    isThirdParty: { type: Boolean, required: true },
    isBoth: { type: Boolean, required: true },
    cart: [{ type: Object, ref: 'Item' }],
    reward: { type: Number, default: 0 },
    previousOrders: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Order' }],
    email: { type: String, required: true, unique: true, },
    mobile: { type: String, required: true, minlength: 10 },
    img: {
        type: String,
        default: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    },
    imgHash: { type: String, default: 'LFOWvnof00j[00ayD%ay~qfQ?bj[' }
});
UserSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("User", UserSchema);
