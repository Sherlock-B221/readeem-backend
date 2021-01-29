"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.editBook = exports.getBookById = exports.createBook = exports.getAllBooks = void 0;
const book_1 = __importDefault(require("../models/book"));
const validate_1 = require("../utils/validate");
const request_error_1 = __importDefault(require("../middlewares/request-error"));
const getAllBooks = async (req, res, next) => {
    try {
        const books = await book_1.default.find().lean();
        res.json({
            books
        });
    }
    catch (err) {
        const error = new request_error_1.default("Error in finding books.", 400, err);
        next(error);
    }
};
exports.getAllBooks = getAllBooks;
const createBook = async (req, res, next) => {
    validate_1.validate(req, next);
    const { title, categories, rewardPoints, keywords, publishedDate, author, bookUrl } = req.body;
    let cover;
    try {
        cover = req.file.path;
    }
    catch (err) {
        console.log(err);
        const error = new request_error_1.default(err.message, err.code, err);
        return next(error);
    }
    cover = 'https://win75.herokuapp.com/' + cover;
    try {
        const createdBook = new book_1.default({
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
        res.json({ status: "success", createdBook });
    }
    catch (err) {
        const error = new request_error_1.default("Error in adding book.", 400, err);
        next(error);
    }
};
exports.createBook = createBook;
const getBookById = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const book = await book_1.default.findById(bookId).lean();
        res.status(200).json({
            status: "success",
            book: book,
        });
    }
    catch (err) {
        const error = new request_error_1.default("Error finding the book with id.", 400, err);
        next(error);
    }
};
exports.getBookById = getBookById;
const editBook = async (req, res, next) => {
    validate_1.validate(req, next);
    const bookId = req.params.id;
    let book;
    try {
        book = await book_1.default.findById(bookId);
    }
    catch (err) {
        const error = new request_error_1.default("Something went wrong.Error finding the book with id.", 400, err);
        next(error);
    }
    if (!book) {
        const error = new request_error_1.default("Book with this id, doesn't exist.", 404);
        next(error);
    }
    const { title, rewardPoints, keywords, publishedDate, author, cover, bookUrl } = req.body;
    book.author = author;
    book.title = title;
    book.rewardPoints = rewardPoints;
    book.keywords = keywords;
    book.publishedDate = publishedDate;
    book.cover = cover;
    book.bookUrl = bookUrl;
    try {
        await book.save();
    }
    catch (err) {
        const error = new request_error_1.default(err.message, 500);
        next(error);
    }
    res.status(200).json({
        "status": "success",
        updatedBook: book,
    });
};
exports.editBook = editBook;
const deleteBook = async (req, res, next) => {
    const id = req.params.id;
    try {
        await book_1.default.deleteOne({ _id: id });
        await res.json({
            "status": "success",
            "message": "Book deleted successfully, if it existed."
        });
    }
    catch (e) {
        const error = new request_error_1.default("Error in deleting book.", 400, e);
        next(error);
    }
};
exports.deleteBook = deleteBook;
