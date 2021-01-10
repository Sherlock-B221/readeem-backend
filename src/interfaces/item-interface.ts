import {Document} from 'mongoose';

export interface IItem extends Document {
    name: string,
    description: string,
    price: number,
    discountedRewardPrice:number,
    tags: Array<string>,
    couponCode:string,
    sellerName: string,
    sellerEmail: string,
    sellerNumber: string,
    keywords:Array<string>,
    categories: Array<string>
}