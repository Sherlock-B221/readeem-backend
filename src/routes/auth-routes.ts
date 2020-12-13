import * as express from 'express';
import {body, check} from 'express-validator';
import {changePassword, forgotPassword, login, logout, resetPassword, signUp} from '../controllers/auth-controller.js'
import {fileUpload} from "../middlewares/file-upload";
import checkAuth from "../middlewares/check-auth";

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

router.post('/forgotPassword',
    [
        body('email')
            .not().isEmpty().normalizeEmail()
            .isEmail(),
    ],
    forgotPassword
);

router.post('/changePassword',
    [
        body('currentPassword').isLength({min: 6}),
        body('newPassword').isLength({min: 6}),
    ],
    checkAuth,
    changePassword
);

router.post('/resetPassword',
    [
        body('newPassword').isLength({min: 6}),
    ],
    resetPassword
);

router.get('/logout',
    checkAuth,
    logout
);


export default router;