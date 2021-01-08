import Book from "../models/book";
// import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {validate} from "../utils/validate";
import RequestError from "../middlewares/request-error";
import {IBook} from "../interfaces/book-interface";
// import {validationResult} from "express-validator";

export const getAllBooks: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req,next);
    let books;
    try{
        books = Book.find();
    }catch (err){
        const error = new RequestError("Error in finding books.", 400, err);
        next(error);
    }
    res.json(
        {
            "books": books

        }
)



};

export const createBook: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req, next);
    const {title, categories, rewardPoints, keywords, publishedDate, author, cover, bookUrl} = req.body;
    console.log(title);
    try {
        const createdBook = new Book({
            title,
            categories,
            rewardPoints,
            keywords,
            publishedDate,
            author,
            bookUrl,
            ratings: 0
        });
        if (cover) {
            createdBook.cover = cover;
        }
        await createdBook.save();
        res.json({status: "success", createdBook});
    } catch (err) {
        const error = new RequestError("Error in adding book.", 400, err);
        next(error);
    }
};

export const getBookById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let bookId=req.params.id;
    let book;
    try{
        book = Book.findById(bookId);
    }catch (err){
        const error = new RequestError("Error finding the book with id.", 400, err);
        next(error);
    }
    res.status(200).json(
        {
            status:"success",
            book:book,
        }

    )


};

export const editBook: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    validate(req,next);
    const bookId = req.params.id;
    let book:IBook;
    try{
        book = await Book.findById(bookId);
    }catch (err)
    {
        const error = new RequestError("Something went wrong.Error finding the book with id.", 400, err);
        next(error);
    }
    if(!book){
        const error = new RequestError("Book with this id, doesn't exist.", 404);
        next(error);
    }
    const {title, rewardPoints, keywords, publishedDate, author, cover, bookUrl} = req.body;
    book.author=author;
    book.title=title;
    book.rewardPoints=rewardPoints;
    book.keywords=keywords;
    book.publishedDate=publishedDate;
    book.cover=cover;
    book.bookUrl=bookUrl;
    try{
        await book.save();
    }catch (err){
        const error = new RequestError(
            err.message,
            500
        );
        next(error);
    }
    res.status(200).json({
        "status":"success",
        updatedBook: book,
    })

};

export const deleteBook: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {


};