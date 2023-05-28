import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from 'axios'
import { errorResult } from '../utils/constants/results'
import messages from '../utils/constants/messages'
import tokenHelper from '../utils/helpers/token.helper';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];

    if (!token)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.token_missing)
        );

    try {
        const decoded = tokenHelper.verifyToken(token);
        console.log(decoded)
        req.user.userId = parseInt(decoded as string)
    } catch {
        return res.status(HttpStatusCode.Unauthorized).json(
            errorResult(null, messages.token_invalid)
        );
    }

    return next();
}