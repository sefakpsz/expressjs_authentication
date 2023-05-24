import { Router, Request, Response, NextFunction } from 'express'

import { login, logout, register, changePassword, resetPassword, checkMfas } from '../controllers/auth.controller'

import { validator, Register, Login, ChangePassword, ResetPassword, CheckMfas } from '../validations/auth.validations';

const router = Router();

const use = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

//ASK OSMAN TO USAGE OF BODY INSTEAD OF QUERY
router.post('/register', validator.query(Register), use(register));

router.post('/securityControl', validator.query(CheckMfas), checkMfas);

router.get('/login', validator.query(Login), login);

router.post('/logout', logout);

router.post('/passwordChange', validator.query(ChangePassword), changePassword);

router.post('/passwordReset', validator.query(ResetPassword), resetPassword);

export default router;