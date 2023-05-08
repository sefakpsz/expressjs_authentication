// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

import { randomBytes } from "crypto";

// dotenv.config();

// import { validationError, notFoundError } from './middlewares/error.middleware';
// import { verifyToken } from './middlewares/auth.middleware';

// import auth from './routes/auth.routes'
// import board from './routes/board.routes'
// import card from './routes/card.routes'
// import group from './routes/group.routes'

// const app = express();

// app.use('/auth', auth);
// app.use('/board', board);
// app.use('/card', card);
// app.use('/group', group);

// app.use(validationError);
// app.use(notFoundError);
// app.use(verifyToken);

// app.listen(process.env.port, async () => {
//     await mongoose.connect(`${process.env.mongoConnectionString}`)
//         .then(() => {
//             console.log(`Connected to MongoDb!\nhttp://127.0.0.1:${process.env.port} is listening...`)
//         })
//         .catch((error) => {
//             console.log(error)
//         })
// })

import userModel from './models/user';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const a = async () => {

    const aldjsf = {
        iasdfsadfsadfd: "asdfsadf",
        email: "req.body.emailldd",
        passwordHash: "passwordHashAndSalt.hash",
        passwordSalt: "passwordHashAndSalt.salt",
        name: "req.body.name",
        surname: "req.body.surname"
    }

    await mongoose.connect(`${process.env.mongoConnectionString}`)
        .then(() => {
            userModel.create(aldjsf).then(data => { console.log(data.id) })
        })
}
a();