import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import { validationError, unknownError } from './middlewares/error.middleware';
import { verifyToken } from './middlewares/auth.middleware';

import auth from './routes/auth.routes'
import board from './routes/board.routes'
import card from './routes/card.routes'
import group from './routes/group.routes'

import { connectToDb } from './databases/index'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Adding something is needed because i.e 1907/ is return error or something like that...

app.use('/auth', auth);
app.use('/board', board);
app.use('/card', card);
app.use('/group', group);

app.use(validationError);
app.use(unknownError);
app.use(verifyToken);

app.listen(process.env.port, async () => {
    await connectToDb()
        .then(() => {
            console.log(`http://127.0.0.1:${process.env.port} is listening...`)
        })
})