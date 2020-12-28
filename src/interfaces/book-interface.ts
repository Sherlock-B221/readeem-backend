import {Document} from "mongoose";

export interface IBook extends Document {
    title: string,
    bookUrl:string,
    rewardPoints:number,
    publishedDate: Date,
    rating: number,
    keywords: Array<string>,
    categories: Array<string>,
    author: string,
    cover: string
}