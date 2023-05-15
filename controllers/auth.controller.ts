import { Request, Response, NextFunction } from 'express';
import { ValidatedRequest } from "express-joi-validation";
import { HttpStatusCode } from "axios";
import { sendMail } from '../utils/providers/mail/config';
import { successResult, errorResult } from '../utils/constants/results'
import { createPasswordHash, verifyPasswordHash } from '../utils/helpers/password.helper'
import messages from '../utils/constants/messages'
import userModel from '../models/user'
import distinctiveModel from '../models/userDistinctive'
import { LoginType, RegisterType } from '../types/auth.types';
import { randomBytes } from 'crypto';
import { BaseStatusEnum, MfaEnum, MfaStatusEnum } from '../utils/constants/enums';
import userDistinctiveModel from '../models/userDistinctive';
import userMfaModel from '../models/userMfas';
import mfaLogModel from '../models/mfaLog';

//#region Logic of Auth
/* 

User'll enter mail and password --> it returns a distinctiveCode

With help of distinguishCode, user get mfa/mfas (which options are selected from user)

User go to the getToken() type distinguishCode-MFA code/codes

if all of them true, user get his/her token
and write trigger in the mongodb when expireDate is came status of distinguishDate will be false!

*/
//#endregion

export const login = async (req: ValidatedRequest<LoginType>, res: Response, next: NextFunction) => {

    const email = req.body.email
    const password = req.body.password

    const user = await userModel.findOne({ email, status: BaseStatusEnum.Active })
        .catch(error => {
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    error
                )
            )
        })

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.user_couldnt_found
            )
        )

    const passwordVerification = await verifyPasswordHash(req.body.password, `user.passwordHash`, `user.passwordSalt`)

    if (!passwordVerification)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.user_wrong_password
            )
        )

    const userDistinctiveData = {
        user,
        code: randomBytes(8)
    }

    await userDistinctiveModel.create(userDistinctiveData)
        .catch(error => {
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    error
                )
            )
        })


    const activeMfasOfUser = await userMfaModel.find({ user: `user._id`, status: BaseStatusEnum.Active })
        .catch(error => {
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    error
                )
            )
        })

    if (activeMfasOfUser.length === 0)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.
            )
        )

    for (let mfa of activeMfasOfUser) {
        if (mfa.mfaType === MfaEnum.Email) {
            sendMail(`user.email`, "Login", `Email Code: user.email`)
            await mfaLogModel.create({
                user: user._id,
                mfaType: MfaEnum.Email,
                dioristicCode: randomBytes(2),
                status: MfaStatusEnum.NotUsed,
                expireDate: 
            })
        }
        else if (mfa.mfaType === MfaEnum.GoogleAuth)
            // google auth implementation
    }
    // check to the which mfa type active for that user and then send code according to infos into activennesOfMfa of user



    return res.status(HttpStatusCode.BadRequest).json(
        successResult(
            userDistinctiveData.code,
            messages.success
        )
    )
}

export const logout = (req: Request, res: Response, next: NextFunction) => {

    /*
    via token go to user's token info and make expire prop to true and write current datetime to updatedAt
     */

}

export const register = async (req: ValidatedRequest<RegisterType>, res: Response, next: NextFunction) => {

    const isEmailExists = await userModel.findOne({ email: req.body.email, status: true }).exec();

    if (isEmailExists)
        return res
            .status(HttpStatusCode.BadRequest)
            .json(errorResult(null, messages.user_already_exists))

    const password = req.body.password;
    const passwordHashAndSalt = await createPasswordHash(password);

    const user = {
        id: "",
        email: req.body.email,
        passwordHash: passwordHashAndSalt.hash,
        passwordSalt: passwordHashAndSalt.salt,
        name: req.body.name,
        surname: req.body.surname
    }

    await userModel.create(user)
        .then(data => {
            user.id = data.id;
        })
        .catch(error => {
            console.error(error);
            return res
                .status(HttpStatusCode.BadRequest)
                .json(errorResult(null, messages.user_add_failed));
        });

    const distinctiveCode = randomBytes(4).toString('hex');

    const distinctiveData = {
        user: user.id,
        code: distinctiveCode
    }

    await distinctiveModel.create(distinctiveData)
        .catch(error => {
            console.error(error);
            return res
                .status(HttpStatusCode.BadRequest)
                .json(errorResult(null, messages.distinctive_add_failed));
        });

    return res
        .status(HttpStatusCode.Ok)
        .json(successResult(distinctiveCode, messages.success))
}

// export const sendMfaCode = (req: Request, res: Response, next: NextFunction) => {

//     //send mfa code with help of type of mfa and send it after checking distinctive code
// }

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