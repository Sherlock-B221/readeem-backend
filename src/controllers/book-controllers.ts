import Book from "../models/book";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {validate} from "../utils/validate";
import RequestError from "../middlewares/request-error";
import {IBook} from "../interfaces/book-interface";

export const getAllBooks: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const books = await Book.find().lean();
        res.json(
            {
                books
            });
    }catch (err){
        const error = new RequestError("Error in finding books.", 400, err);
        next(error);
    }
};

export const createBook: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    // validate(req, next);
    const {title, categories, rewardPoints, keywords, publishedDate,author, bookUrl} = req.body;
    let cover;
    try {

        cover =  req.file.path;
    } catch (err) {
        console.log(err);
        const error = new RequestError(err.message, err.code, err);
        return next(error);
    }
    cover = 'https://win75.herokuapp.com/' + cover;
    try {
        const createdBook = new Book({
            title,
            categories,
            rewardPoints,
            keywords,
            publishedDate,
            cover,
            author,
            bookUrl,
            ratings: 0
        });
        await createdBook.save();
        res.json({status: "success", createdBook});
    } catch (err) {
        const error = new RequestError("Error in adding book.", 400, err);
        next(error);
    }
};

export const getBookById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const bookId=req.params.id;
        const book = await Book.findById(bookId).lean();
        res.status(200).json(
            {
                status:"success",
                book:book,
            })
    }catch (err){
        const error = new RequestError("Error finding the book with id.", 400, err);
        next(error);
    }
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
    const id = req.params.id;
    try {
        await Book.deleteOne({_id: id});
        await res.json({
            "status": "success",
            "message": "Book deleted successfully, if it existed."
        });
    } catch (e) {
        const error = new RequestError("Error in deleting book.", 400, e);
        next(error);
    }
};