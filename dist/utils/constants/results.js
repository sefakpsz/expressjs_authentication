"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownErrorResult = exports.errorResult = exports.successResult = void 0;
const axios_1 = require("axios");
const express_1 = __importDefault(require("express"));
const res = express_1.default.response;
const successResult = (data, message) => {
    return {
        success: true,
        data,
        message
    };
};
exports.successResult = successResult;
const errorResult = (data, message) => {
    return {
        success: false,
        data,
        message
    };
};
exports.errorResult = errorResult;
const unknownErrorResult = () => {
    (error) => {
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, exports.errorResult)(null, error.message));
    };
};
exports.unknownErrorResult = unknownErrorResult;
