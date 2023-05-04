import { Request, Response, NextFunction } from 'express';
import { ValidatedRequest } from "express-joi-validation";
import { HttpStatusCode } from "axios";
import { sendMail } from '../utils/providers/mail/config';
import { errorDataResult, successDataResult, successResult, errorResult } from '../utils/constants/results'
import { createPasswordHash, verifyPasswordHash } from '../utils/helpers/password.helper'
import userModel from '../models/user'
import { LoginType } from '../types/auth.types';


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

export const register = async (req: ValidatedRequest<LoginType>, res: Response, next: NextFunction) => {

    const isEmailExists = await userModel.findOne({ email: req.body.email, status: true }).exec();

    if (isEmailExists)
        return res
            .status(HttpStatusCode.BadRequest)
            .json(errorResult("User already exists!"))

    const password = req.body.password;
    const passwordHashAndSalt = await createPasswordHash(password);

    const user = {
        email: req.body.email,
        passwordHash: passwordHashAndSalt.hash,
        passwordSalt: passwordHashAndSalt.salt,
        name: req.body.name,
        surname: req.body.surname
    }

    await userModel.create(user)
        .catch(error => {
            console.error(error);
            return res
                .status(HttpStatusCode.BadRequest)
                .json(errorResult("User creation failed!"));
        });

    /*
    firstly check is email exists in my db 
        if it does --> return error message about it
        if it doesn't --> save mail with password hashes to db and generate a security code uniquely with help of some packages then save it in the db too
    send mail to the user a welcome mail and send to a message with email code
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
    // enter email code, token, old&new password then and change password
}

export const passwordReset = (req: Request, res: Response, next: NextFunction) => {

    /*
    get mail of user
    send mailCode to user via e-mail authorize to user
    and then with mail code, email and password reset to password
    */

}