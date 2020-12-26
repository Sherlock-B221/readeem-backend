import {Document} from "mongoose";
import {BookMark} from "./book-mark";

export interface IBook extends Document {
    bookMark: BookMark,
    title: string,
    publishedDate: Date,
    rating: number,
    keywords: Array<string>,
    categories: Array<string>,
    author: string,
    cover: string
}