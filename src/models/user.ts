import * as mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';


const UserSchema: mongoose.Schema = new mongoose.Schema({
    name: {type: String, required: true},
    completedBooks: [{type: mongoose.Types.ObjectId, ref: 'Book'}],
    inProgressBooks: [{type: mongoose.Types.ObjectId, ref: 'Book'}],
    favBooks: [{type: mongoose.Types.ObjectId, ref: 'Book'}],
    joinDate: {type: Date, required: true},
    cart: [{type: mongoose.Types.ObjectId, ref: 'Item'}],
    reward: {type: Number, default: 0},
    previousOrders: [{type: mongoose.Types.ObjectId, ref: 'Order'}],
    email: {type: String, required: true, unique: true,},
    mobile: {type: Number, required: true, minlength: 10},
    img: {
        type: String,
        default: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    }
})

UserSchema.plugin(uniqueValidator);

export default mongoose.model("User", UserSchema);