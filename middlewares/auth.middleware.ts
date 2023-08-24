import { Request, Response, NextFunction } from 'express'
import { HttpStatusCode } from 'axios'
import { errorResult } from '../utils/constants/results'
import messages from '../utils/constants/messages'
import tokenHelper from '../utils/helpers/token.helper'
import userModel from '../models/user.model'
import { getUserSession } from '../utils/helpers/session.helper'

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1] as string
  // token need to be taken from session not from header

  if (!token) return res.status(HttpStatusCode.Unauthorized).json(errorResult(null, messages.token_missing))

  const decoded = tokenHelper.verifyToken(token) as string

  const user = await userModel.findById(decoded)

  if (!user) return res.status(HttpStatusCode.BadRequest).json(errorResult(null, messages.user_couldnt_found))

  const session = await getUserSession(req, decoded)

  if (!session) return res.status(HttpStatusCode.Unauthorized).json(errorResult(null, messages.session_not_found))

  if (new Date().getTime() > parseInt(session.expireDate))
    return res.status(HttpStatusCode.Unauthorized).json(errorResult(null, messages.session_expired))

  req.user = user

  return next()
}

export default authMiddleware
