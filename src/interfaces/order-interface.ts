import {Document} from "mongoose";
import {IItem} from "./item-interface";
import {IUser} from "./user-interface";

export interface IOrderItem {
    _id: IItem['_id'],
    quantity:number
}
export interface IOrder extends Document {
    items: Array<IOrderItem>,
    userId: IUser['_id'],
    orderDate: Date,
    totalRewardPrice: number
}