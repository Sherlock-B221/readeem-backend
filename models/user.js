const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');


const UserSchema = new mongoose.Schema({
    name: {type: String, default: 'User'},
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {type: String, required: false, minlength: 6},
    mobile: {type: Number, required: false, minlength: 10},
    img: {
        type: String,
        default: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    }

})

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);