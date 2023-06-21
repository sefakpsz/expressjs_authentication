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
exports.connectToDb = void 0;
const mongo_1 = require("./types/mongo");
const redis_1 = require("./types/redis");
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_1.connectToMongo)();
    yield (0, redis_1.connectToRedis)();
});
exports.connectToDb = connectToDb;
