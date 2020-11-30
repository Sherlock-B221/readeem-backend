import {ErrorWithCode} from "../interfaces/error_with_code";

class RequestError implements ErrorWithCode {
    // this would give an error by default. To suppress it go to lib.es5.d.ts and on line 973 add a '?' after name and before ':'
    constructor(message: string, errorCode: number, err?: Error) {
        this.code = errorCode;
        this.message = message;
        // If err is passed, it will be logged on the console
        if (err) {
            console.log("\n")
            const currentdate = new Date();

            const datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

            console.log(`The following error occured on ${datetime}:`);
            console.log(err.message);
            console.log("error catched");
            console.log("\n")
        }
    }

    code: number;
    message: string;
}

export default RequestError;