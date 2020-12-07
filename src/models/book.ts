import * as mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import {IBook} from "../interfaces/book-interface";


const BookSchema: mongoose.Schema = new mongoose.Schema({
    title: {type: String, required: true},
    bookMark: {type: Object, default: {}},
    publishedDate: {type: Date, required: true},
    author: {type: String, required: true},
    cover: {
        type: String,
        default: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    }
})

BookSchema.plugin(uniqueValidator);

export default mongoose.model<IBook>("Book", BookSchema);