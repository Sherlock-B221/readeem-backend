import {Document} from "mongoose";

export interface IBook extends Document {
    title: string,
    publishedDate: Date,
    rating: number,
    keywords: Array<string>,
    categories: Array<string>,
    author: string,
    cover: string
}