"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
//imap and maillistener5 could be use for future requirements
let transporterConfig = {
    host: process.env.mailHost,
    port: parseInt(process.env.mailPort),
    secure: false,
    auth: {
        user: process.env.mailUser,
        pass: process.env.mailPassword,
    },
};
let transporter = (0, nodemailer_1.createTransport)(transporterConfig);
const sendMail = (to, subject, text, code) => __awaiter(void 0, void 0, void 0, function* () {
    let mailOptions = {
        from: "teamofmsk@outlook.com",
        to,
        subject,
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        // else {
        //   console.log("Email sent: " + info.response)
        // }
    });
});
exports.sendMail = sendMail;
