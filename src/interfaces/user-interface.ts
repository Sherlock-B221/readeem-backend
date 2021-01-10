import {Document} from "mongoose";
import {IBook} from "./book-interface";
import {IOrder, IOrderItem} from "./order-interface";
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
    cart: Array<IOrderItem>,
    reward: number,
    previousOrders: Array<IOrder['_id']>,
    email: string,
    mobile: string,
    img: string,
    imgHash: string
}