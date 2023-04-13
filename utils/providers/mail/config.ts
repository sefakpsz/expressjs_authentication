// import nodemailer from 'nodemailer';

// let transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'testsefakapisiz@outlook.com',
//         pass: 'sefa1907'
//     }
// });

// let mailOptions = {
//     from: 'testsefakapisiz@outlook.com',
//     to: 'm.sefa06@hotmail.com',
//     subject: 'Test email',
//     text: 'This is a test email from Nodemailer'
// };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });

class MailProvider {
    constructor() {

    }

    sendMail(from: any, to: any) {

    }
}

export default new MailProvider()