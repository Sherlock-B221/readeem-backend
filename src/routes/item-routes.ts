import * as express from 'express';
import {check} from 'express-validator';
import {dummyRoute} from '../controllers/user-controller.js'

const router = express.Router();

router.post('/addUserToDb'
    , [
        check('email')
            .isEmail(),
    ]
    , dummyRoute
);


export default router;