import { Router, Request, Response, NextFunction } from 'express'

import { login, logout, register, changePassword, resetPassword, checkMfas, checkMfasPass } from '../controllers/auth.controller'

import { validator, Register, Login, ChangePassword, ForgotPassword, CheckMfas, CheckMfasPass } from '../validations/auth.validations';

const router = Router();

const use = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', validator.query(Register), use(register));

router.get('/checkMfas', validator.query(CheckMfas), use(checkMfas));

router.get('/checkMfasPass', validator.query(CheckMfasPass), use(checkMfasPass));

router.get('/login', validator.query(Login), use(login));

router.post('/logout', use(logout));

router.post('/passwordChange', validator.query(ChangePassword), use(changePassword));

router.post('/passwordForgot', validator.query(ForgotPassword), use(resetPassword));

export default router;