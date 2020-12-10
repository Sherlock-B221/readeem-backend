import * as express from 'express';
import {check} from 'express-validator';
import {signUp} from '../controllers/user-controller.js'

const router = express.Router();

router.post('/'
    , [
        check('email')
            .isEmail(),
    ]
    , signUp
);


export default router;