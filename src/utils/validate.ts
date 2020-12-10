import {ValidationError, validationResult} from "express-validator";
import RequestError from "../middlewares/request-error";
import {NextFunction, Request} from 'express';


export const validate = (req: Request, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let params = "";
        errors.array().forEach((e: ValidationError) => {
            params += `${e.param}, `
        });
        params += "triggered the error!!";
        return next(
            new RequestError(params, 422)
        );
    }
};
