import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import {IBook} from "../interfaces/book-interface";


const BookSchema: mongoose.Schema = new mongoose.Schema({
    title: {type: String, required: true},
    ratings: {type: Number, required: false},
    categories: [{type: String, required: true}],
    keywords: [{type: String, required: true}],
    publishedDate: {type: Date, required: true},
    bookUrl: {type: String, required: true},
    rewardPoints: {type: String, required: true},
    author: {type: String, required: true},
    cover: {
        type: String,
        default: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    }
})

BookSchema.plugin(uniqueValidator);

export default mongoose.model<IBook>("Book", BookSchema);