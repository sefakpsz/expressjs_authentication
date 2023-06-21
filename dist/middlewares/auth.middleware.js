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
const axios_1 = require("axios");
const results_1 = require("../utils/constants/results");
const messages_1 = __importDefault(require("../utils/constants/messages"));
const token_helper_1 = __importDefault(require("../utils/helpers/token.helper"));
const user_1 = __importDefault(require("../models/user"));
const session_helper_1 = require("../utils/helpers/session.helper");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    // token need to be taken from session not from header
    if (!token)
        return res.status(axios_1.HttpStatusCode.Unauthorized).json((0, results_1.errorResult)(null, messages_1.default.token_missing));
    const decoded = token_helper_1.default.verifyToken(token);
    const user = yield user_1.default.findById(decoded);
    if (!user)
        return res.status(axios_1.HttpStatusCode.BadRequest).json((0, results_1.errorResult)(null, messages_1.default.user_couldnt_found));
    const session = yield (0, session_helper_1.getUserSession)(req, decoded);
    if (!session)
        return res.status(axios_1.HttpStatusCode.Unauthorized).json((0, results_1.errorResult)(null, messages_1.default.session_not_found));
    if (new Date().getTime() > parseInt(session.expireDate))
        return res.status(axios_1.HttpStatusCode.Unauthorized).json((0, results_1.errorResult)(null, messages_1.default.session_expired));
    req.user = user;
    return next();
});
exports.default = authMiddleware;
