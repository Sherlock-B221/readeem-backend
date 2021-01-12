import mailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import RequestError from "../middlewares/request-error";
import {NextFunction} from "express";

export const sendMail = async (link: string, email: string, next: NextFunction) => {
    let transporter = mailer.createTransport(smtpTransport({
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
    } catch (error) {
        console.log(error);
        console.log("bb");
        throw new RequestError('Authentication failed! Access and Refresh Tokens does not exist', 401);
    }
}
