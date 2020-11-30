import * as express from 'express';
import {check} from 'express-validator';
import {signUp} from '../controllers/user-controller.js'

const router = express.Router();

router.get('/signup'
    , [
        check('email')

            .isEmail(),
        check('password').isLength({min: 6}),
    ]
    , signUp
);


export default router;