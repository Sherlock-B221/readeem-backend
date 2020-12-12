import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import {IOrder} from "../interfaces/order-interface";


const OrderSchema: mongoose.Schema = new mongoose.Schema({
    item: [{type: mongoose.Types.ObjectId, ref: 'Item', required: true}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    orderDate: {type:Date,required:true},
    totalPrice: {type:Number,required: true}
});

OrderSchema.plugin(uniqueValidator);

export default mongoose.model<IOrder>("Order", OrderSchema);