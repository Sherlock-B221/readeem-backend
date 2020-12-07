import {Document} from "mongoose";
import {IItem} from "./item-interface";
import {IUser} from "./user-interface";

export interface IOrder extends Document {
    item: Array<IItem['_id']>,
    userId: IUser['_id'],
    orderDate: Date,
    totalPrice: number
}