import {Document} from "mongoose";
import {IBook} from "./book-interface";
import {IItem} from "./item-interface";
import {IOrder} from "./order-interface";
import {BookMark} from "./book-mark";

export interface IUser extends Document {
    name: string,
    password: string,
    completedBooks: Array<IBook['_id']>,
    inProgressBooks: Array<BookMark>,
    favBooks: Array<IBook['_id']>,
    joinDate: Date,
    isThirdParty: boolean,
    isBoth: boolean,
    changePasswordDate: Date,
    cart: Array<IItem['_id']>,
    reward: number,
    previousOrders: Array<IOrder['_id']>,
    email: string,
    mobile: string,
    img: string,
    imgHash: string
}