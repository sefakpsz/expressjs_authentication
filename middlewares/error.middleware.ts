import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { errorResult } from '../utils/constants/results'
import messages from '../utils/constants/messages';

export const unknownError = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.message)
    return res.status(HttpStatusCode.BadRequest).json(
        errorResult(null, messages.error)
    )
}

export const validationError = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    if (err) {
        return res.status(HttpStatusCode.BadRequest).json({
            error: err.error.details
        });
    }
    return next();
};
