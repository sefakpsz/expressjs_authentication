import express from 'express'
import dotenv from 'dotenv'
//asdasdas
dotenv.config()

import { validationError, unknownError } from './middlewares/error.middleware'
import authMiddleware from './middlewares/auth.middleware'

import auth from './routes/auth'
import board from './routes/board'
import card from './routes/card'
import group from './routes/group'

import { connectToDb } from './databases/index'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', auth)
app.use('/board', board)
app.use('/card', card)
app.use('/group', group)

app.use(validationError)
app.use(unknownError)
app.use(authMiddleware)

app.listen(process.env.port, async () => {
  await connectToDb().then(async () => {
    console.log(`http://127.0.0.1:${process.env.port || 1708} is listening...`)
  })
})

// Asymmetric Algorithm
// const { publicKey, privateKey, } = generateKeyPairSync("rsa", {
//   modulusLength: 2048,
// })

// const encryptedText = publicEncrypt({
//   key: publicKey,
//   padding: constants.RSA_PKCS1_OAEP_PADDING,//optional
//   oaepHash: 'sha256'//optional
// },
//   Buffer.from("sefa")
// )

// const decryptedText = privateDecrypt(
//   {
//     key: privateKey,
//     padding: constants.RSA_PKCS1_OAEP_PADDING,//optional
//     oaepHash: 'sha256'//optional
//   },
//   encryptedText
// )

// console.log(encryptedText.toString('base64'))

// console.log('decrypted text:', decryptedText.toString())
