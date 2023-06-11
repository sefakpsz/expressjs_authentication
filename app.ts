// import express, { Request, Response } from 'express';
// import dotenv from 'dotenv';

// dotenv.config();

// import { validationError, unknownError } from './middlewares/error.middleware';
// import authMiddleware from './middlewares/auth.middleware';

// import auth from './routes/auth.routes'
// import board from './routes/board.routes'
// import card from './routes/card.routes'
// import group from './routes/group.routes'

// import { connectToDb } from './databases/index'

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// //Adding something is needed because i.e 1907/ is return error or something like that...

// app.use('/auth', auth);
// app.use('/board', board);
// app.use('/card', card);
// app.use('/group', group);

// app.use(validationError);
// app.use(unknownError);
// app.use(authMiddleware);

// app.listen(process.env.port, async () => {
//     await connectToDb()
//         .then(() => {
//             console.log(`http://127.0.0.1:${process.env.port} is listening...`)
//         })
// })

import { SchemaFieldTypes, createClient } from 'redis';
import redis from 'ioredis'

interface IResult {
    token: string,
    expireDate: string
}

const someFunct = async () => {
    const client = createClient();

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('sefa', 'ayşo');

    const sefa = await client.get('sefa');

    console.log(sefa)

    const session = {
        token: "TOKEN",
        expireDate: "EXP_DATE"
    }

    await client.set('userSession:1224', JSON.stringify(session));

    let result = await client.get('userSession:1224')

    console.log(JSON.parse(result || ""))

    client.setEx("key", 3600, JSON.stringify(session))

    console.log(JSON.parse(await client.get("key") || ""))

    const result2 = JSON.parse(await client.get("key") || "") as IResult

    console.log(result2.expireDate)

    await client.hSet("JWT Sessions", "userId_IPAddress", JSON.stringify(session))

    const result3 = JSON.parse(await client.hGet("JWT Sessions", "userId_IPAddress") || "") as IResult

    console.log(result3.token)

    await client.lPush("myList", ["1", "2"])
    await client.lInsert("myList", "AFTER", "AFTER", "1")
}

const someFunct2 = async () => {
    const client = redis.createClient()
    //await client.connect()

    await client.hset('user-session:123', {
        name: 'John',
        surname: 'Smith',
        company: 'Redis',
        age: 29
    })

    let userSession = await client.hgetall('user-session:123');
    console.log(JSON.stringify(userSession, null, 2));

}

someFunct()
//someFunct2()