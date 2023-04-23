import { Request, Response, NextFunction } from 'express';
import { sendMail } from '../utils/providers/mail/config';
import { errorDataResult, successDataResult, successResult, errorResult } from '../utils/constants/results'

export const login = (req: Request, res: Response, next: NextFunction) => {
    // get email and password and these are correct send mail and authenticate
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    //there should be a expire prop in db and for logouting go to db and make expire boolean true
}

export const register = (req: Request, res: Response, next: NextFunction) => {

    /*
    firstly check is email exists in my db 
        if it does --> return error message about it
        if it doesn't --> save mail with password hashes to db and generate a security code uniquely with help of some packages then save it in the db too
    send mail to the user a welcome mail and send to a message as email code
    */


    //sendMail(req.body.email, `SUBJECT`, `MESSAGE`);
    successResult("successfull");
}

export const securityControl = (req: Request, res: Response, next: NextFunction) => {
    /*
    find user from securityCode
    and go to the mfa table to check provided mail code is equal with in db
    if it does createToken (use token.helper.ts) and send to the user
    if it doesn't save it password history table as fail try and send error
    */
}

export const passwordChange = (req: Request, res: Response, next: NextFunction) => {
    // get email old&new password then authenticate from mail ands change password
}

export const passwordReset = (req: Request, res: Response, next: NextFunction) => {
    // get only email and send mail after authentication change password
    // but don't allow to get in after all go to login page again
}