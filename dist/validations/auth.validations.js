"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = exports.ChangePassword = exports.Login = exports.SendMfaCode = exports.SendEmailPass = exports.CheckMfas = exports.Register = exports.validator = void 0;
const express_joi_validation_1 = require("express-joi-validation");
const joi_1 = __importDefault(require("joi"));
exports.validator = (0, express_joi_validation_1.createValidator)({ passError: true });
const passwordRules = (value, helpers) => {
    // write your own password rules and add as below example
    // .custom(passwordRules).required();
};
exports.Register = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    surname: joi_1.default.string().required()
});
exports.CheckMfas = joi_1.default.object({
    distinctiveCode: joi_1.default.string().required(),
    emailCode: joi_1.default.number(),
    googleCode: joi_1.default.number()
});
exports.SendEmailPass = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.SendMfaCode = joi_1.default.object({
    code: joi_1.default.string().required()
});
exports.Login = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.ChangePassword = joi_1.default.object({
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().required(),
});
exports.ForgotPassword = joi_1.default.object({
    distinctiveCode: joi_1.default.string().required(),
    emailCode: joi_1.default.number(),
    googleCode: joi_1.default.number(),
    newPassword: joi_1.default.string().required()
});
