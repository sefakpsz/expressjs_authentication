import { Router, Request, Response, NextFunction } from 'express'

import { login, logout, register, changePassword, forgotPassword, checkMfas, sendEmailPass } from '../controllers/auth.controller'

import { validator, Register, Login, ChangePassword, ForgotPassword, CheckMfas, SendEmailPass } from '../validations/auth.validations';

const router = Router();

const use = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', validator.query(Register), use(register));

router.get('/checkMfas', validator.query(CheckMfas), use(checkMfas));

router.get('/sendEmailPass', validator.query(SendEmailPass), use(sendEmailPass));

router.get('/login', validator.query(Login), use(login));

router.post('/logout', use(logout));

router.post('/passwordChange', validator.query(ChangePassword), use(changePassword));

router.post('/passwordForgot', validator.query(ForgotPassword), use(forgotPassword));

export default router;