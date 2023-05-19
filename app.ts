// import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// import { validationError, unknownError } from './middlewares/error.middleware';
// import { verifyToken } from './middlewares/auth.middleware';

// import auth from './routes/auth.routes'
// import board from './routes/board.routes'
// import card from './routes/card.routes'
// import group from './routes/group.routes'

// import { connectToDb } from './databases/index'

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use('/auth', auth);
// app.use('/board', board);
// app.use('/card', card);
// app.use('/group', group);

// app.use(validationError);
// app.use(unknownError);
// app.use(verifyToken);

// app.listen(process.env.port, async () => {
//     await connectToDb()
//         .then(() => {
//             console.log(`http://127.0.0.1:${process.env.port} is listening...`)
//         })
// })

import { sign, verify } from 'jsonwebtoken'
import { randomInt, createCipheriv, createDecipheriv } from 'crypto';

const tokenKey = Buffer.from(process.env.tokenKey as string, 'hex')
const payloadKey = Buffer.from(process.env.payloadKey as string, 'hex')
const payloadIv = Buffer.from(process.env.payloadIv as string, 'hex')
const encryptionAlgorithm = process.env.encryptionAlgorithm as string

export const createToken = (email: string, userId: string) => {

    const cipherUserId = createCipheriv(encryptionAlgorithm, payloadKey, payloadIv);
    const encryptedUserId = cipherUserId.update(userId, 'utf-8', 'hex') + cipherUserId.final('hex');

    const payload = { email, userId: encryptedUserId }

    const cipherPayload = createCipheriv(encryptionAlgorithm, payloadKey, payloadIv);
    const encryptedPayload = cipherPayload.update(JSON.stringify(payload), 'utf8', 'hex') + cipherPayload.final('hex');

    const dummyEmails = [
        "sefakapisiz@gmail.com",
        "taharamazan@hotmail.com",
        "mehmetkaya@outlook.com",
        "aliefe@gmail.com",
        "osmanşen@hotmail.com",
        "aysotas@hotmail.com",
        "tugcesener@gmail.com"
    ]
    const whichOne = randomInt(1, 7);

    const payloadOfPayload =
    {
        userId: encryptedPayload,
        email: dummyEmails[whichOne]
    }


    const token = sign(
        {
            userId: encryptedPayload,
            email: dummyEmails[whichOne]
        },
        tokenKey,
        {
            expiresIn: "3d",
        }
    );

    return token;
}

console.log(createToken("email", "userId"))