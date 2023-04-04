import express from 'express';

import mongoose from 'mongoose';

const app = express();

app.listen(1907, async () => {
    await mongoose.connect("mongodb+srv://sefakpsz:paOy6AywARUAsOS1@cluster0.y4mw8zp.mongodb.net/BaseDb?retryWrites=true&w=majority")
        .then(() => {
            console.log("App is started successfully!\nConnected to MongoDb!")
        })
        .catch((error) => {
            console.log(error)
        })
})
