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
exports.sendEmailPass = exports.forgotPassword = exports.changePassword = exports.checkMfas = exports.register = exports.logout = exports.login = void 0;
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

User'll enter mail and password --> it returns a distinctiveCode randomBytes(4).toString("hex")

With help of distinctiveCode, user get mfa/mfas (which options are selected from user)

User go to the getToken() type distinctiveCode-MFA code/codes

if all of them true, user get his/her token
and
(use hooks for that reason https://mongoosejs.com/docs/middleware.html#post-async)
WRITE TRIGGER in the mongodb when expireDate is came status of distinctiveCode will be false!

JWT

- Keep a global list of JWTs that have been revoked before they expired (and remove the tokens after expiry).
    Instead of letting webservers hit a server to get this list, push the list to each server using a pub/sub mechanism.
- Revoking tokens is important for security, but rare. Realistically this list is small and easily fits into memory.
    This largely solves the logout issue.

 payload{
    email: sefakapisiz@gmail.com,
    userId: encryptedPayload
 }
*/
//#endregion
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.query;
    const user = yield user_1.default.findOne({ email, status: enums_1.BaseStatusEnum.Active });
    if (!user)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_couldnt_found));
    const passwordVerification = yield (0, password_helper_1.verifyPasswordHash)(password, user.passwordHash, user.passwordSalt);
    if (!passwordVerification)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_wrong_password));
    const userDistinctiveData = {
        user,
        code: (0, crypto_1.randomBytes)(4).toString("hex"),
        expireDate: new Date().setMinutes(new Date().getMinutes() + 5)
    };
    const userDistinctiveFromDb = yield userDistinctive_1.default.findOne({ user: user.id });
    if (userDistinctiveFromDb)
        yield userDistinctive_1.default.updateOne({ _id: userDistinctiveFromDb.id }, { code: userDistinctiveData.code, expireDate: userDistinctiveData.expireDate });
    else
        yield userDistinctive_1.default.create(userDistinctiveData);
    const userMfas = yield userMfa_1.default.findOne({ user: user._id });
    if ((userMfas === null || userMfas === void 0 ? void 0 : userMfas.mfaTypes.length) === 0)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.userMfa_couldnt_found));
    userMfas === null || userMfas === void 0 ? void 0 : userMfas.mfaTypes.forEach((mfa) => __awaiter(void 0, void 0, void 0, function* () {
        if (mfa.type === enums_1.MfaEnum.Email) {
            yield sendEmailFunc(user.id, user.email, "Login");
        }
        else if (mfa.type === enums_1.MfaEnum.GoogleAuth) {
            // google auth implementation
        }
    }));
    return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.successResult)({ distinctiveCode: userDistinctiveData.code }, messages_1.default.success));
});
exports.login = login;
const sendEmailFunc = (userId, email, subject) => __awaiter(void 0, void 0, void 0, function* () {
    let emailCode = (0, crypto_1.randomInt)(100000, 999999);
    const date = new Date();
    yield (0, config_1.sendMail)(email, subject, `Email Code: ${emailCode}`);
    yield userMfa_1.default.updateOne({
        user: new mongoose_1.Types.ObjectId(userId),
        "mfaTypes.type": enums_1.MfaEnum.Email,
    }, {
        $set: {
            "mfaTypes.$.code": emailCode,
            "mfaTypes.$.expireDate": date.setMinutes(date.getMinutes() + 5)
        },
    });
    return { emailCode };
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id.toString();
    yield (0, session_helper_1.clearUserSession)(req, userId);
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)(true, messages_1.default.success));
});
exports.logout = logout;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, surname } = req.query;
    const isEmailExists = yield user_1.default.findOne({ email, status: true });
    if (isEmailExists)
        return res
            .status(axios_1.HttpStatusCode.BadRequest)
            .json((0, results_1.errorResult)(null, messages_1.default.user_already_exists));
    const passwordHashAndSalt = yield (0, password_helper_1.createPasswordHash)(password);
    const user = {
        id: "",
        email,
        passwordHash: passwordHashAndSalt.hash,
        passwordSalt: passwordHashAndSalt.salt,
        name,
        surname
    };
    yield user_1.default.create(user)
        .then(data => {
        user.id = data.id;
    });
    yield userMfa_1.default.create({
        user: user.id,
        mfaTypes: [{ type: enums_1.MfaEnum.Email }]
    });
    return res
        .status(axios_1.HttpStatusCode.Ok)
        .json((0, results_1.successResult)(true, messages_1.default.success));
});
exports.register = register;
const createDistinctiveCode = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, crypto_1.randomBytes)(5).toString('hex');
});
const checkMfas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { distinctiveCode, emailCode, googleCode } = req.query;
    const mfaResult = yield checkMfaCodes(distinctiveCode, emailCode, googleCode);
    if (!(mfaResult === null || mfaResult === void 0 ? void 0 : mfaResult.success))
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, mfaResult === null || mfaResult === void 0 ? void 0 : mfaResult.message));
    console.log(mfaResult.data);
    const userDistinctive = mfaResult.data;
    const token = (0, token_helper_1.createToken)(userDistinctive.user);
    yield (0, session_helper_1.setUserSession)(req, userDistinctive.user, token);
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)({ token }, messages_1.default.success));
});
exports.checkMfas = checkMfas;
const checkMfaCodes = (distinctiveCode, emailCode, googleCode) => __awaiter(void 0, void 0, void 0, function* () {
    const userDistinctive = yield userDistinctive_1.default.findOne({ code: distinctiveCode, status: enums_1.BaseStatusEnum.Active }).populate("user");
    if (!userDistinctive)
        return (0, results_1.errorResult)(null, messages_1.default.userDistinctive_couldnt_find);
    if (userDistinctive.expireDate < Date.now())
        return (0, results_1.errorResult)(null, messages_1.default.expired_distinctive_code);
    const user = yield user_1.default.findOne(userDistinctive.user);
    if (!user)
        return (0, results_1.errorResult)(null, messages_1.default.user_couldnt_found);
    const mfaDataOfUser = yield userMfa_1.default.findOne({
        user: user._id,
        "mfaTypes.status": enums_1.BaseStatusEnum.Active
    });
    if (!mfaDataOfUser)
        return;
    (0, results_1.errorResult)(null, messages_1.default.userMfa_couldnt_found);
    mfaDataOfUser.mfaTypes.forEach(mfa => {
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
            return;
        (0, results_1.errorResult)(null, messages_1.default.expired_code);
        mfa.code = 0, mfa.expireDate = 0;
    });
    yield mfaDataOfUser.save();
    return (0, results_1.successResult)(userDistinctive, messages_1.default.success);
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.query;
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
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { distinctiveCode, emailCode, googleCode, newPassword } = req.query;
    const userDistinctiveData = yield userDistinctive_1.default.findOne({ code: distinctiveCode });
    if (!userDistinctiveData)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.userDistinctive_couldnt_find));
    if (userDistinctiveData.expireDate < Date.now())
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.expired_distinctive_code));
    const user = yield user_1.default.findById(userDistinctiveData.user);
    if (!user)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_couldnt_found));
    yield (0, session_helper_1.clearUserSessions)(user.id.toString());
    const userMfaData = yield userMfa_1.default.findOne({ user });
    if (!userMfaData)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.userMfa_couldnt_found));
    userMfaData.mfaTypes.forEach(mfa => {
        switch (mfa.type) {
            case enums_1.MfaEnum.Email:
                {
                    if (mfa.code !== emailCode)
                        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.wrong_email_code));
                }
                break;
            case enums_1.MfaEnum.GoogleAuth:
                {
                    if (mfa.code !== googleCode)
                        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.wrong_google_code));
                }
                break;
            default:
                break;
        }
        if (mfa.expireDate < Date.now())
            return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.expired_code));
        mfa.code = 0, mfa.expireDate = 0;
    });
    yield userMfaData.save();
    const { hash, salt } = yield (0, password_helper_1.createPasswordHash)(newPassword);
    if (hash === user.passwordHash)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_same_password));
    yield user_1.default.updateOne({ _id: user.id }, { passwordHash: hash, passwordSalt: salt });
    yield (0, session_helper_1.clearUserSessions)(user.id.toString());
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)(true, messages_1.default.user_password_updated));
});
exports.forgotPassword = forgotPassword;
const sendEmailPass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    const user = yield user_1.default.findOne({ email });
    if (!user)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_couldnt_found));
    yield sendEmailFunc(user.id, email, "Forgetten Password");
    const distinctiveCode = yield createDistinctiveCode();
    const date = new Date();
    yield userDistinctive_1.default.updateOne({ user }, {
        code: distinctiveCode,
        expireDate: date.setMinutes(date.getMinutes() + 3)
    });
    return res.status(axios_1.HttpStatusCode.Ok).json((0, results_1.successResult)({ distinctiveCode }, messages_1.default.success));
});
exports.sendEmailPass = sendEmailPass;
