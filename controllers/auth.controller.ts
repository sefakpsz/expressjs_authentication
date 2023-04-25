import { Request, Response, NextFunction } from 'express';
import { sendMail } from '../utils/providers/mail/config';
import { errorDataResult, successDataResult, successResult, errorResult } from '../utils/constants/results'

export const login = (req: Request, res: Response, next: NextFunction) => {

    /*
    get mail and password
    firstly check is there any mail in db
        if there isn't send error message
    then check password
        if password is wrong send error message
    then if all of them is true send mail to securityCode
    */
}

export const logout = (req: Request, res: Response, next: NextFunction) => {

    /*
    via token go to user's token info and make expire prop to true and write current datetime to updatedAt
     */

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

    /*
    get mail of user
    send mailCode to user via e-mail and authorize to user and via that code 
    */

}