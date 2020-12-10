import mailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

export const sendMail = (code: string, email: string) => {
    let transporter = mailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASS
        }
    }));

    const mailOptions = {
        from: process.env.EMAIL_NAME,
        to: email,
        subject: '',
        text: `${code} 
        Use this as a temporary password, please change it when you login. 
        We will not be responsible if it is leaked.`
    };
    transporter.sendMail(mailOptions, function (error: Error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Mail sent");
        }
    });
}
