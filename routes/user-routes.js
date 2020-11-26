const express = require('express');
const router = new express.Router();
const {check} = require('express-validator');

router.post('/signup'
    , [
        check('email')

            .isEmail(),
        check('password').isLength({min: 6}),
    ]
    , userController.signUp
);



module.exports = router;