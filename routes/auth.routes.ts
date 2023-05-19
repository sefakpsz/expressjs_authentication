import { Router } from 'express'

import { login, logout, register, changePassword, forgottenPassword, checkMfas } from '../controllers/auth.controller'

import { validator, Register, Login, ChangePassword, ForgottenPassword, CheckMfas } from '../validations/auth.validations';

const router = Router();

//ASK OSMAN TO USAGE OF BODY INSTEAD OF QUERY
router.post('/register', validator.body(Register), register);

router.post('/securityControl', validator.query(CheckMfas), checkMfas);

router.get('/login', validator.query(Login), login);

router.post('/logout', logout);

router.post('/passwordChange', validator.query(ChangePassword), changePassword);

router.post('/passwordReset', validator.query(ForgottenPassword), forgottenPassword);

export default router;