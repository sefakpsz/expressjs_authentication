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
exports.clearUserSession = exports.clearUserSessions = exports.getUserSession = exports.setUserSession = void 0;
const redis_1 = require("../../databases/types/redis");
const redisHashName = process.env.redisHashName;
const setUserSession = (req, userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const session = {
        token,
        expireDate: date.setHours(date.getHours() + 72)
    };
    const ip = getIP(req.ip.toString());
    yield redis_1.redisServer.hSet(redisHashName, `${userId}_${ip}`, JSON.stringify(session))
        .catch(err => {
        console.error(err);
        return false;
    });
    return true;
});
exports.setUserSession = setUserSession;
const getUserSession = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = getIP(req.ip.toString());
    const redisResponse = yield redis_1.redisServer.hGet(redisHashName, `${userId}_${ip}`)
        .catch(err => {
        console.error(err);
        return false;
    });
    if (!redisResponse)
        return false;
    const userSession = JSON.parse(redisResponse);
    if (!userSession.token)
        return false;
    return userSession;
});
exports.getUserSession = getUserSession;
const clearUserSessions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let userSessions = yield redis_1.redisServer.hKeys(redisHashName);
    const emptySession = { token: "", expireDate: "" };
    userSessions.forEach((session) => __awaiter(void 0, void 0, void 0, function* () {
        if (session.includes(userId))
            yield redis_1.redisServer.hSet(redisHashName, session, JSON.stringify(emptySession));
    }));
});
exports.clearUserSessions = clearUserSessions;
const clearUserSession = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = { token: "", expireDate: "" };
    const ip = getIP(req.ip.toString());
    yield redis_1.redisServer.hSet(redisHashName, `${userId}_${ip}`, JSON.stringify(session));
});
exports.clearUserSession = clearUserSession;
const getIP = (ip) => {
    return ip.split(':').slice(-1).toString();
    // req.headers['x-forwarded-for'].tos ||
    // req.header('x-forwarded-for')
};
