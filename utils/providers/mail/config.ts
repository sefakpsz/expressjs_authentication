import { createTransport } from 'nodemailer';

// mailHost = smtp.office365.com
// mailPort = 587
// mailUser = testsefakapisiz@outlook.com
// mailPassword = sefa1907

let transporterConfig = {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: "testsefakapisiz@outlook.com",
        pass: "sefa1907"
    }
}

let transporter = createTransport(transporterConfig);

export const sendMail = async (to: string, subject: string, text: string, code?: string) => {
    let mailOptions = {
        from: 'MSK',
        to,
        subject,
        text
    };

    console.log(mailOptions)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}