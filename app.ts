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

import redis from "ioredis";
import { createClient } from "redis";

interface IResult {
  token: string;
  expireDate: string;
}

const someFunct = async () => {
  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  const session = {
    token: "TOKEN",
    expireDate: "EXP_DATE",
  };

  await client.hSet("JWT Sessions", "106_ev", JSON.stringify(session));

  const result3 = JSON.parse(
    (await client.hGet("JWT Sessions", "userId_IPAddress")) || ""
  ) as IResult;

  console.log(result3.token);
};

const someFunct2 = async () => {
  const client = redis.createClient();
  //await client.connect()

  await client.hset("user-session:123", {
    name: "John",
    surname: "Smith",
    company: "Redis",
    age: 29,
  });

  let userSession = await client.hgetall("user-session:123");
  console.log(JSON.stringify(userSession, null, 2));
};

someFunct();
//someFunct2()
