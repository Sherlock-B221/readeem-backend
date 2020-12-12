import mailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

export const sendMail = (link: string, email: string) => {
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
        text: `${link} 
        This Link will expire in 10 mins, please don't share it.
        Regards,
        Team READeem
        `
    };
    transporter.sendMail(mailOptions, function (error: Error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Mail sent");
        }
    });
}
