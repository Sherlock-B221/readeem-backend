import * as express from 'express';
import {check} from 'express-validator';
import checkAuth from "../middlewares/check-auth";
import checkSuperUser from "../middlewares/super-user";
import {createBook, deleteBook, editBook, getAllBooks, getBookById} from "../controllers/book-controllers";
import {singleFileUpload} from "../middlewares/single-file-upload";


const router = express.Router();
// todo: use multer for file upload
router.post('/post'
    , [
        check('title')
            .not().isEmpty(),
        check('categories')
            .not().isEmpty(),
        check('keywords')
            .not().isEmpty(),
        check('publishedDate')
            .not().isEmpty(),
        check('author')
            .not().isEmpty(),
        check('bookUrl')
            .not().isEmpty(),
        check('rewardPoints')
            .not().isEmpty(),
        singleFileUpload('uploads/bookCovers','cover'),
    ]
    ,  checkSuperUser, createBook
);

router.get('/get/all', checkAuth, getAllBooks);

router.get('/get/one/:id', checkAuth, getBookById);

router.patch('/patch/:id',[
        check('title')
            .not().isEmpty(),
        check('categories')
            .not().isEmpty(),
        check('keywords')
            .not().isEmpty(),
        check('publishedDate')
            .not().isEmpty(),
        check('author')
            .not().isEmpty(),
        check('bookUrl')
            .not().isEmpty(),
        check('rewardPoints')
            .not().isEmpty(),
], checkSuperUser, editBook);

router.delete('/delete/:id', checkSuperUser, deleteBook);

export default router;