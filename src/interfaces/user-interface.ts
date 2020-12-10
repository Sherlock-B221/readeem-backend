import {Document} from "mongoose";
import {IBook} from "./book-interface";
import {IItem} from "./item-interface";
import {IOrder} from "./order-interface";

export interface IUser extends Document {
    name: string,
    password: string,
    completedBooks: Array<IBook['_id']>,
    inProgressBooks: Array<IBook['_id']>,
    favBooks: Array<IBook['_id']>,
    joinDate: Date,
    cart: Array<IItem['_id']>,
    reward: number,
    previousOrders: Array<IOrder['_id']>,
    email: string,
    mobile: number,
    img: string
}