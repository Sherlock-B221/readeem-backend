import Book from "../models/book";
// import RequestError from "../middlewares/request-error";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {validate} from "../utils/validate";
import RequestError from "../middlewares/request-error";
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
    await res.json(books);


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

};

export const editBook: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

};

export const deleteBook: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {


};