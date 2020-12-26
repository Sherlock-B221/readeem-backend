import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import {IItem} from "../interfaces/item-interface";


const ItemSchema: mongoose.Schema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    discountedRewardPrice: {type: Number, required: true},
    tags: [{type: String, required: true}],
    // it is to be stored in encryption
    couponCode: {type: String, required: true},
    sellerName: {type: String, required: true},
    sellerEmail: {type: String, required: true},
    sellerNumber: {type: String, required: true},
    categories: [{type: String, required: true}],
})

ItemSchema.plugin(uniqueValidator);

export default mongoose.model<IItem>("Item", ItemSchema);