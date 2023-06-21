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
exports.verifyPasswordHash = exports.createPasswordHash = void 0;
const crypto_1 = require("crypto");
const iterations = 1000;
const keyLength = 64;
const hashAlgorithm = "sha512";
const createPasswordHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const hash = (0, crypto_1.pbkdf2Sync)(password, salt, iterations, keyLength, hashAlgorithm)
        .toString('hex');
    return { hash, salt };
});
exports.createPasswordHash = createPasswordHash;
const verifyPasswordHash = (password, hashFromDb, saltFromDb) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = (0, crypto_1.pbkdf2Sync)(password, saltFromDb, iterations, keyLength, hashAlgorithm)
        .toString('hex');
    if (hash === hashFromDb)
        return true;
    else
        return false;
});
exports.verifyPasswordHash = verifyPasswordHash;
