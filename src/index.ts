import mongoose from "mongoose";
import * as fs from "fs";
import {ErrorWithCode} from "./interfaces/error_with_code";

import express, {NextFunction, Request, Response} from 'express';

import userRoutes from './routes/user-routes';
import authRoutes from './routes/auth-routes';
import itemRoutes from './routes/item-routes';
import bookRoutes from './routes/book-routes';
import orderRoutes from './routes/order-routes';

import RequestError from './middlewares/request-error';

require('dotenv').config();

const app = express();

app.use(express.json());

//Routes
app.use('/api/ping', express.Router().get('/', async (req: Request, res: Response, next: NextFunction) => {
        res.json({
                'status': 'success',
                'message': "Pinged!!!"
            }
        )
    })
);
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/user', userRoutes);


//Unsupported Routes
app.use((req: Request, res: Response, next: NextFunction) => {
    throw new RequestError('Cannot find this Route!', 404);
})

//Error Handling for any other error
app.use((error: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        fs.unlink(req.file.path, (err: any) => {
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

mongoose
    .connect(
        `mongodb+srv://admin:iamadmin@cluster0.eqegx.mongodb.net/MyOwn?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(() => {
        app.listen(process.env.PORT || process.env.SV_PORT, () => {
            console.log("Started server on Port", process.env.PORT);
        });
    })
    .catch(err => {
        console.log(err);
    });