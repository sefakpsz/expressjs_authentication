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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.forgotPassword = exports.changePassword = exports.checkMfas = exports.register = exports.logout = exports.login = void 0;
const axios_1 = require("axios");
const config_1 = require("../utils/providers/mail/config");
const results_1 = require("../utils/constants/results");
const password_helper_1 = require("../utils/helpers/password.helper");
const messages_1 = __importDefault(require("../utils/constants/messages"));
const user_1 = __importDefault(require("../models/user"));
const crypto_1 = require("crypto");
const enums_1 = require("../utils/constants/enums");
const userDistinctive_1 = __importDefault(require("../models/userDistinctive"));
const userMfa_1 = __importDefault(require("../models/userMfa"));
const token_helper_1 = require("../utils/helpers/token.helper");
const mongoose_1 = require("mongoose");
const session_helper_1 = require("../utils/helpers/session.helper");
//#region Logic of Auth
/*
    remove userDistinctive model and combine it with userMfas model
    limit the sending email in determined minutes
    move all implementations into the services/authentication.service.ts file
*/
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOne({ email, status: enums_1.BaseStatusEnum.Active });
    if (!user)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_couldnt_found));
    const passwordVerification = yield (0, password_helper_1.verifyPasswordHash)(password, user.passwordHash, user.passwordSalt);
    if (!passwordVerification)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_wrong_password));
    const userDistinctiveData = {
        user,
        code: yield createDistinctiveCode(),
        expireDate: new Date().setMinutes(new Date().getMinutes() + 5),
    };
    const userDistinctiveFromDb = yield userDistinctive_1.default.findOne({ user: user.id });
    if (userDistinctiveFromDb)
        yield userDistinctive_1.default.updateOne({ _id: userDistinctiveFromDb.id }, { code: userDistinctiveData.code, expireDate: userDistinctiveData.expireDate });
    else
        yield userDistinctive_1.default.create(userDistinctiveData);
    const userMfas = yield userMfa_1.default.findOne({ user: user._id });
    if ((userMfas === null || userMfas === void 0 ? void 0 : userMfas.mfaTypes.length) === 0)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.userMfa_couldnt_found));
    return res
        .status(axios_1.HttpStatusCode.BadRequest)
        .json((0, results_1.successResult)({ distinctiveCode: userDistinctiveData.code }, messages_1.default.success));
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id.toString();
    yield (0, session_helper_1.clearUserSession)(req, userId);
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)(null, messages_1.default.success));
});
exports.logout = logout;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, surname } = req.body;
    const isEmailExists = yield user_1.default.findOne({ email, status: true });
    if (isEmailExists)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_already_exists));
    const passwordHashAndSalt = yield (0, password_helper_1.createPasswordHash)(password);
    const user = yield user_1.default.create({
        email,
        passwordHash: passwordHashAndSalt.hash,
        passwordSalt: passwordHashAndSalt.salt,
        name,
        surname,
    });
    yield userMfa_1.default.create({
        user: user.id,
        mfaTypes: [{ type: enums_1.MfaEnum.Email }],
    });
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)(null, messages_1.default.success));
});
exports.register = register;
const checkMfas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { distinctiveCode, emailCode, googleCode } = req.body;
    const userDistinctive = yield userDistinctive_1.default
        .findOne({ code: distinctiveCode, status: enums_1.BaseStatusEnum.Active })
        .populate('user');
    if (!userDistinctive)
        return (0, results_1.errorResult)(null, messages_1.default.userDistinctive_couldnt_find);
    if (userDistinctive.expireDate < Date.now())
        return (0, results_1.errorResult)(null, messages_1.default.expired_distinctive_code);
    const user = yield user_1.default.findById(userDistinctive.user);
    if (!user)
        return (0, results_1.errorResult)(null, messages_1.default.user_couldnt_found);
    const mfaResult = yield checkMfaCodes(emailCode, googleCode, user.id);
    if (!(mfaResult === null || mfaResult === void 0 ? void 0 : mfaResult.success))
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, mfaResult === null || mfaResult === void 0 ? void 0 : mfaResult.message));
    const token = (0, token_helper_1.createToken)(user.id);
    yield (0, session_helper_1.setUserSession)(req, user.id, token);
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)({ token }, messages_1.default.success));
});
exports.checkMfas = checkMfas;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    const verificationOfOldPassword = yield (0, password_helper_1.verifyPasswordHash)(oldPassword, user.passwordHash, user.passwordSalt);
    if (!verificationOfOldPassword)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_wrong_password));
    const { hash, salt } = yield (0, password_helper_1.createPasswordHash)(newPassword);
    if (hash === user.passwordHash)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_same_password));
    yield user_1.default.updateOne({ _id: user._id }, { passwordHash: hash, passwordSalt: salt });
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)(null, messages_1.default.success));
});
exports.changePassword = changePassword;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, emailCode, googleCode, newPassword } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user)
        return (0, results_1.errorResult)(null, messages_1.default.user_couldnt_found);
    const mfaResult = yield checkMfaCodes(emailCode, googleCode, user.id);
    if (!(mfaResult === null || mfaResult === void 0 ? void 0 : mfaResult.success))
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, mfaResult === null || mfaResult === void 0 ? void 0 : mfaResult.message));
    yield (0, session_helper_1.clearUserSessions)(user.id);
    const { hash, salt } = yield (0, password_helper_1.createPasswordHash)(newPassword);
    if (hash === user.passwordHash)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_same_password));
    yield user_1.default.updateOne({ _id: user.id }, { passwordHash: hash, passwordSalt: salt });
    yield (0, session_helper_1.clearUserSessions)(user.id);
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)(null, messages_1.default.user_password_updated));
});
exports.forgotPassword = forgotPassword;
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, operation } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user)
        return (0, results_1.errorResult)(null, messages_1.default.user_couldnt_found);
    if (!user)
        return (0, results_1.errorResult)(null, messages_1.default.user_couldnt_found);
    switch (operation) {
        case enums_1.MailOperations.Login:
            yield sendEmailFunc(user === null || user === void 0 ? void 0 : user.id, user === null || user === void 0 ? void 0 : user.email, 'Login');
            break;
        case enums_1.MailOperations.ForgotPassword:
            yield sendEmailFunc(user === null || user === void 0 ? void 0 : user.id, user === null || user === void 0 ? void 0 : user.email, 'Forgotten Password');
            break;
        default:
            break;
    }
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)(null, messages_1.default.success));
});
exports.sendEmail = sendEmail;
const createDistinctiveCode = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, crypto_1.randomBytes)(5).toString('hex');
});
const sendEmailFunc = (userId, email, subject) => __awaiter(void 0, void 0, void 0, function* () {
    let emailCode = (0, crypto_1.randomInt)(100000, 999999);
    const date = new Date();
    yield (0, config_1.sendMail)(email, subject, `Email Code: ${emailCode}`);
    yield userMfa_1.default.updateOne({
        user: new mongoose_1.Types.ObjectId(userId),
        'mfaTypes.type': enums_1.MfaEnum.Email,
    }, {
        $set: {
            'mfaTypes.$.code': emailCode,
            'mfaTypes.$.expireDate': date.setMinutes(date.getMinutes() + 5),
        },
    });
    return { emailCode };
});
const checkMfaCodes = (emailCode, googleCode, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const mfaDataOfUser = yield userMfa_1.default.findOne({
        user: userId,
        'mfaTypes.status': enums_1.BaseStatusEnum.Active,
    });
    if (!mfaDataOfUser)
        return (0, results_1.errorResult)(null, messages_1.default.userMfa_couldnt_found);
    for (let mfa of mfaDataOfUser.mfaTypes) {
        switch (mfa.type) {
            case enums_1.MfaEnum.Email:
                {
                    if (mfa.code !== emailCode)
                        return (0, results_1.errorResult)(null, messages_1.default.wrong_email_code);
                }
                break;
            case enums_1.MfaEnum.GoogleAuth:
                {
                    if (mfa.code !== googleCode)
                        return (0, results_1.errorResult)(null, messages_1.default.wrong_google_code);
                }
                break;
            default:
                break;
        }
        if (mfa.expireDate < Date.now())
            return (0, results_1.errorResult)(null, messages_1.default.expired_code);
    }
    return (0, results_1.successResult)(null, messages_1.default.success);
});
