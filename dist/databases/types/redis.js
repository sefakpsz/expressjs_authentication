"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToRedis = exports.redisServer = void 0;
const redis_1 = require("redis");
const connectToRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.redisServer = (0, redis_1.createClient)({
        url: process.env.redisURL,
    });
    exports.redisServer.on('error', (err) => console.log('Redis Client Error', err));
    yield exports.redisServer
        .connect()
        .then(() => {
        console.log('Connected To Redis!');
    })
        .catch((error) => {
        console.log(error.message);
        console.error(error);
        process.exit();
    });
});
exports.connectToRedis = connectToRedis;
