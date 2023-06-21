"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validations_1 = require("../validations/auth.validations");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
const catching = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/register', auth_validations_1.validator.query(auth_validations_1.Register), catching(auth_controller_1.register));
router.get('/checkMfas', auth_validations_1.validator.query(auth_validations_1.CheckMfas), catching(auth_controller_1.checkMfas));
router.get('/sendEmailPass', auth_validations_1.validator.query(auth_validations_1.SendEmailPass), catching(auth_controller_1.sendEmailPass));
router.get('/login', auth_validations_1.validator.query(auth_validations_1.Login), catching(auth_controller_1.login));
router.post('/logout', auth_middleware_1.default, catching(auth_controller_1.logout));
router.post('/passwordChange', auth_middleware_1.default, auth_validations_1.validator.query(auth_validations_1.ChangePassword), catching(auth_controller_1.changePassword));
router.post('/passwordForgot', auth_validations_1.validator.query(auth_validations_1.ForgotPassword), catching(auth_controller_1.forgotPassword));
exports.default = router;
