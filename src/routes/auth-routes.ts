import * as express from 'express';
import {body, check} from 'express-validator';
import {login, signUp} from '../controllers/auth-controller.js'
import {fileUpload} from "../middlewares/file-upload";

const router = express.Router();

router.post('/signUp'
    , [
        check('name')
            .not()
            .isEmpty(),
        body('mobile')
            .not()
            .isEmpty(),
        body('email')
            .normalizeEmail()
            .isEmail(),
        body('password').isLength({min: 6}),
        fileUpload.single('image'),
    ]
    , signUp
);
router.post('/login'
    , [
        body('email')
            .not().isEmpty().normalizeEmail()
            .isEmail(),
        body('password').isLength({min: 6}),
    ]
    , login
);


export default router;