"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationError = exports.unknownError = void 0;
const axios_1 = require("axios");
const results_1 = require("../utils/constants/results");
const messages_1 = __importDefault(require("../utils/constants/messages"));
const unknownError = (error, req, res, next) => {
    console.error(error.message);
    return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.error));
};
exports.unknownError = unknownError;
const validationError = (err, req, res, next) => {
    console.log(err);
    if (err) {
        return res.status(axios_1.HttpStatusCode.BadRequest).json({
            error: err.error.details
        });
    }
    return next();
};
exports.validationError = validationError;
