import {NextFunction, Request, Response} from "express";
import RequestError from "./request-error";

const checkSuperUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let superSecretKey: string = req.body.superSecretKey;
        if(superSecretKey===undefined){
           superSecretKey = req.query.superSecretKey as string;
        }
        if (superSecretKey === process.env.SUPER_SECRET_KEY) {
            next();
        } else {
            const error = new RequestError(`Not super user!!!`, 403);
            return next(error);
        }

    } catch (e) {
        const error = new RequestError(`Error occurred while checking super user.`, 403);
        return next(error);
    }
}

export default checkSuperUser;