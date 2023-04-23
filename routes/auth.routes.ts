import { Router } from 'express'

import { login, logout, register, passwordChange, passwordReset } from '../controllers/auth.controller'

import { validator, Register, Login, PasswordChange, PasswordReset } from '../validations/auth.validations';

const router = Router();

//ASK OSMAN TO USAGE OF BODY INSTEAD OF QUERY
router.post('/register', validator.query(Register), register);

router.get('/login', validator.query(Login), login);

router.post('/logout', logout);

router.post('/passwordChange', validator.query(PasswordChange), passwordChange);

router.post('/passwordReset', validator.query(PasswordReset), passwordReset);

export default router;