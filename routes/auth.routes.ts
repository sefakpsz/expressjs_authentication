import { Router } from 'express'

import { login, logout, register, passwordChange, passwordReset } from '../controllers/auth.controller'

import { validator, Register, Login, PasswordChange, PasswordReset } from '../validations/auth.validations';

const router = Router();

router.post('/register', validator.body(Register), register);

router.get('/login', validator.query(Login), login);

router.post('/logout', logout);

router.post('/passwordChange', validator.body(PasswordChange), passwordChange);

router.post('/passwordReset', validator.body(PasswordReset), passwordReset);

export default router;