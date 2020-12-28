import * as express from 'express';
import {check} from 'express-validator';
import checkAuth from "../middlewares/check-auth";
import checkSuperUser from "../middlewares/super-user";
import {createBook, deleteBook, editBook, getAllBooks, getBookById} from "../controllers/book-controllers";


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
    ]
    , checkAuth, checkSuperUser, createBook
);

router.get('/get/all', checkAuth, getAllBooks);

router.get('/get/one/:id', checkAuth, getBookById);

router.patch('/patch', checkSuperUser, editBook);

router.delete('/delete', checkSuperUser, deleteBook);

export default router;