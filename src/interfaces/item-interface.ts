import {Document} from 'mongoose';

export interface IItem extends Document {
    name: string,
    description: string
    price: number
    tags: Array<string>,
    sellerName: string,
    sellerEmail: string,
    sellerNumber: string,
    category: string
}