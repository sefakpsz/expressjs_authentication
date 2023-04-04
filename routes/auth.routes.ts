import { Router } from 'express'

import { login, logout, register, passwordChange, passwordReset } from '../controllers/auth.controller'

export default Router