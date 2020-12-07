import {Document} from "mongoose";
import {BookMark} from "./book-mark";

export interface IBook extends Document {
    bookMark: BookMark,
    title: string,
    publishedDate:Date,
    author:string,
    cover:string
}