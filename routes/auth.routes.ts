import { Router, Request, Response, NextFunction } from 'express'

import { login, logout, register, changePassword, forgotPassword, checkMfas, sendEmailPass } from '../controllers/auth.controller'

import { validator, Register, Login, ChangePassword, ForgotPassword, CheckMfas, SendEmailPass } from '../validations/auth.validations'
import authMiddleware from '../middlewares/auth.middleware'

const router = Router()

const catching = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next)

router.post('/register', validator.query(Register), catching(register))

router.get('/checkMfas', validator.query(CheckMfas), catching(checkMfas))

router.get('/sendEmailPass', validator.query(SendEmailPass), catching(sendEmailPass))

router.get('/login', validator.query(Login), catching(login))

router.post('/logout',authMiddleware, catching(logout))

router.post('/passwordChange', authMiddleware, validator.query(ChangePassword), catching(changePassword))

router.post('/passwordForgot', validator.query(ForgotPassword), catching(forgotPassword))

export default router