import { Request, Response, NextFunction } from 'express'
import { HttpStatusCode } from 'axios'
import { errorResult } from '../utils/constants/results'
import messages from '../utils/constants/messages'
import tokenHelper from '../utils/helpers/token.helper'
import userModel from '../models/user'
import { getUserSession } from '../utils/helpers/session.helper'

// const payloadKey = Buffer.from(process.env.payloadKey as string, 'hex')
// const payloadIv = Buffer.from(process.env.payloadIv as string, 'hex')
// const encryptionAlgorithm = process.env.encryptionAlgorithm as string

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1] as string

    if (!token)
        return res.status(HttpStatusCode.Unauthorized).json(
            errorResult(null, messages.token_missing)
        )

    const decoded = tokenHelper.verifyToken(token) as string

    const user = await userModel.findById(decoded)

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_couldnt_found)
        )

    const ip = req.socket.remoteAddress ||
        req.ip.split(':').slice(-1).toString()
    // ||
    // req.headers['x-forwarded-for'].tos ||
    // req.header('x-forwarded-for')

    const session = await getUserSession(decoded, ip)

    if (!session)
        return res.status(HttpStatusCode.Unauthorized).json(
            errorResult(null, messages.session_not_found)
        )

    if (new Date().getTime() > parseInt(session.expireDate))
        return res.status(HttpStatusCode.Unauthorized).json(
            errorResult(null, messages.session_expired)
        )

    req.user = user

    return next()
}

export default authMiddleware