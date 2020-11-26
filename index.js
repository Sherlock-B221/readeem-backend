require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const userRoutes = require('./routes/user-routes');
const RequestError = require('./middlewares/request-error');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

//Routes
app.use('/user',userRoutes);


//Unsupported Routes
app.use((req,res,next)=>{
    throw new RequestError('Cannot find this Route!',404);
})

//Error Handling for any other error
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        "status": "failed",
        "message": error.message || 'An unknown error occurred!'
    });
});

app.listen(process.env.PORT||process.env.SV_PORT, function () {
    console.log("Started server on Port",process.env.PORT);
})