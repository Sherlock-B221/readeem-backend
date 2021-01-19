import * as express from 'express';
import {body} from 'express-validator';
import {
    addPasswordToUser,
    changePassword,
    forgotPassword,
    login,
    logout,
    resetPassword,
    signUp,
    thirdPartyAuth
} from '../controllers/auth-controller.js'
import {singleFileUpload} from "../middlewares/single-file-upload";
import checkAuth from "../middlewares/check-auth";

const router = express.Router();

router.post('/signUp'
    , [
        body('name')
            .not()
            .isEmpty(),
        body('mobile')
            .not()
            .isEmpty(),
        body('imgHash').not().isEmpty(),
        body('email')
            .normalizeEmail()
            .isEmail(),
        body('password').isLength({min: 6}),
        singleFileUpload('uploads/images','img'),
    ]
    , signUp
);

router.post('/thirdParty'
    , [
        body('name')
            .not()
            .isEmpty(),
        body('mobile')
            .not()
            .isEmpty(),
        body('email')
            .normalizeEmail()
            .isEmail(),
        body('img').not().isEmpty(),
    ]
    , thirdPartyAuth
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

router.post('/addPasswordUser',
    [
        body('password').isLength({min: 6})
    ],
    checkAuth,
    addPasswordToUser
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