import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'testsefakapisiz@outlook.com',
        pass: 'sefa1907'
    }
});

export const sendMail = (to: string, subject: string, text: string, code?: string) => {
    let mailOptions = {
        from: 'testsefakapisiz@outlook.com',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}