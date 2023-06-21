"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const crypto_1 = require("crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
const tokenKey = Buffer.from(process.env.tokenKey, "hex");
const payloadKey = Buffer.from(process.env.payloadKey, "hex");
const payloadIv = Buffer.from(process.env.payloadIv, "hex");
const encryptionAlgorithm = process.env.encryptionAlgorithm;
const createToken = (userId) => {
    const cipherUserId = (0, crypto_1.createCipheriv)(encryptionAlgorithm, payloadKey, payloadIv);
    const encryptedUserId = cipherUserId.update(userId, "utf-8", "hex") + cipherUserId.final("hex");
    const cipherPayload = (0, crypto_1.createCipheriv)(encryptionAlgorithm, payloadKey, payloadIv);
    const encryptedPayload = cipherPayload.update(encryptedUserId, "utf8", "hex") +
        cipherPayload.final("hex");
    const dummyEmails = [
        "sefakapisiz@gmail.com",
        "taharamazan@hotmail.com",
        "mehmetkaya@outlook.com",
        "aliefe@gmail.com",
        "osmanşen@hotmail.com",
        "aysotas@hotmail.com",
        "tugcesener@gmail.com",
    ];
    const whichOne = (0, crypto_1.randomInt)(1, 7);
    const token = (0, jsonwebtoken_1.sign)({
        userId: encryptedPayload,
        // to misguiding to middleman
        email: dummyEmails[whichOne],
    }, tokenKey, {
        expiresIn: "3d",
    });
    return token;
};
exports.createToken = createToken;
const verifyToken = (token) => {
    try {
        //encrypting token
        const decodedToken = (0, jsonwebtoken_1.verify)(token, tokenKey);
        //encrypting fake payload
        const decipher = (0, crypto_1.createDecipheriv)(encryptionAlgorithm, payloadKey, payloadIv);
        const decryptedPayload = decipher.update(decodedToken.userId, "hex", "utf-8") +
            decipher.final("utf8");
        //encrypting payload
        const secondDecipher = (0, crypto_1.createDecipheriv)(encryptionAlgorithm, payloadKey, payloadIv);
        const secondDecryptedPayload = secondDecipher.update(decryptedPayload, "hex", "utf-8") +
            secondDecipher.final("utf8");
        return secondDecryptedPayload;
    }
    catch (error) {
        console.log("Invalid Token");
    }
};
exports.verifyToken = verifyToken;
exports.default = { verifyToken: exports.verifyToken, createToken: exports.createToken };
