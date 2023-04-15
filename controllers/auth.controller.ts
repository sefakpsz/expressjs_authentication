import { Request, Response, NextFunction } from 'express';
import { sendMail } from '../utils/providers/mail/config';
import { errorDataResult, successDataResult, successResult, errorResult } from '../utils/constants/results'

export const login = (req: Request, res: Response, next: NextFunction) => {
    // get email and password and these are correct send mail and authenticate
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    //remove JWT from session
}

export const register = (req: Request, res: Response, next: NextFunction) => {
    //sendMail(req.body.email, `Welcome`, `Your register completed successfully!`);
    successResult("successfull");

    // get email password name and surname and send mail then get him/her in
}

export const passwordChange = (req: Request, res: Response, next: NextFunction) => {
    // get email old&new password then authenticate from mail ands change password
}

export const passwordReset = (req: Request, res: Response, next: NextFunction) => {
    // get only email and send mail after authentication change password
    // but don't allow to get in after all go to login page again
}