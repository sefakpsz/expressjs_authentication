import express from 'express';

import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

import auth from './routes/auth.routes'

const app = express();

app.use('/auth', auth);

app.listen(1907, async () => {
    await mongoose.connect("mongodb+srv://sefakpsz:paOy6AywARUAsOS1@cluster0.y4mw8zp.mongodb.net/BaseDb?retryWrites=true&w=majority")
        .then(() => {
            console.log(`Connected to MongoDb!\nhttp://127.0.0.1:${process.env.PORT} is listening...`)
        })
        .catch((error) => {
            console.log(error)
        })
})
