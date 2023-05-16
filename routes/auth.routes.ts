import { Router } from 'express'

import { login, logout, register, passwordChange, passwordReset, checkMfas } from '../controllers/auth.controller'

import { validator, Register, Login, PasswordChange, PasswordReset, CheckMfas } from '../validations/auth.validations';

const router = Router();

//ASK OSMAN TO USAGE OF BODY INSTEAD OF QUERY
router.post('/register', validator.body(Register), register);

router.post('/securityControl', validator.query(CheckMfas), checkMfas);

//router.post('/sendMfaCode', validator.query(SendMfaCode), sendMfaCode);

router.get('/login', validator.query(Login), login);

router.post('/logout', logout);

router.post('/passwordChange', validator.query(PasswordChange), passwordChange);

router.post('/passwordReset', validator.query(PasswordReset), passwordReset);

export default router;