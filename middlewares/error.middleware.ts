import { NextFunction, Request, Response } from 'express';

export const notFoundError = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(`Error Message: ${error.message}`)
    const status = error.status || 400

    res.status(status).json({
        errorMessage: error.message
    })
}

export const validationError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        return res.status(400).json({
            error: err.error.toString()
        });
    }
    return next();
};
