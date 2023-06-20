import { createTransport } from "nodemailer"
//imap and maillistener5 could be use for future requirements

let transporterConfig = {
  host: process.env.mailHost,
  port: parseInt(process.env.mailPort as string),
  secure: false,
  auth: {
    user: process.env.mailUser,
    pass: process.env.mailPassword,
  },
}

let transporter = createTransport(transporterConfig)

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  code?: string
) => {
  let mailOptions = {
    from: "teamofmsk@outlook.com",
    to,
    subject,
    text,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
    // else {
    //   console.log("Email sent: " + info.response)
    // }
  })
}