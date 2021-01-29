"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const request_error_1 = __importDefault(require("../middlewares/request-error"));
const sendMail = async (link, email, next) => {
    let transporter = nodemailer_1.default.createTransport(nodemailer_smtp_transport_1.default({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.Email_Name,
            pass: process.env.Email_Pass
        }
    }));
    const mailOptions = {
        from: process.env.Email_Name,
        to: email,
        subject: '',
        text: `${link} 
        This Link will expire in 10 mins, please don't share it.
        Regards,
        Team READeem
        `
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log(error);
        console.log("bb");
        throw new request_error_1.default('Authentication failed! Access and Refresh Tokens does not exist', 401);
    }
};
exports.sendMail = sendMail;
