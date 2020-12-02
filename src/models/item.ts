import * as mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';


const ItemSchema: mongoose.Schema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    tags: [{type: String}],
    sellerName: {type: String, required: true},
    sellerEmail: {type: String, required: true},
    sellerNumber: {type: String, required: true},
    category: {type: String, required: true},
})

ItemSchema.plugin(uniqueValidator);

export default mongoose.model("Item", ItemSchema);