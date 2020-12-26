import {IBook} from "./book-interface";

export type BookMark = {
    bookId: IBook['_id'],
    href: string,
    created: number,
    locations: {
        cfi: string
    }
}