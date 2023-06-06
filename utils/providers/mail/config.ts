import { createTransport } from 'nodemailer';

// mailUser = testsefakapisiz@outlook.com

let transporterConfig = {
    host: "smtp.office365.com",
    //host: "smtp-mail.outlook.com"
    port: 587,
    secure: false,
    auth: {
        user: "teamofmsk@outlook.com",
        //user: "testsefakapisiz@outlook.com"
        pass: "Sefa1907"
    }
}

let transporter = createTransport(transporterConfig);

export const sendMail = async (to: string, subject: string, text: string, code?: string) => {
    let mailOptions = {
        from: "teamofmsk@outlook.com",
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