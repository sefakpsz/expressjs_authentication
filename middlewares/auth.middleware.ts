import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from 'axios'
import { errorResult } from '../utils/constants/results'
import messages from '../utils/constants/messages'
import tokenHelper from '../utils/helpers/token.helper';
import userModel from '../models/user';

const payloadKey = Buffer.from(process.env.payloadKey as string, 'hex')
const payloadIv = Buffer.from(process.env.payloadIv as string, 'hex')
const encryptionAlgorithm = process.env.encryptionAlgorithm as string

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1] as string;

    if (!token)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.token_missing)
        )

    const decoded = tokenHelper.verifyToken(token)

    const user = await userModel.findById(decoded)

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_couldnt_found)
        )

    req.user = user

    return next();
}

export default authMiddleware