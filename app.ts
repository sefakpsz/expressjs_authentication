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

import { createClient } from 'redis';

const someFunct = async () => {
    const client = createClient();

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('sefa', 'ayşo');

    const sefa = await client.get('sefa');

    console.log(sefa)

    const session = {
        userId: "userId",
        token: "token",
        expireDate: "expireDate"
    }

    await client.set('userSession:1224', JSON.stringify(session));

    console.log(await client.get('userSession:1224'))

    let TEST_KEY = "TEST_KEY"

    await client.json.set(TEST_KEY, '.', { node: 'blah blah black sheep' });
    const value = await client.json.get(TEST_KEY, {
        // JSON Path: .node = the element called 'node' at root level.
        path: '.node'
    });

    console.log(`value of node: ${value}`);

}

someFunct()