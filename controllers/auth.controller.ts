import { Request, Response, NextFunction } from 'express';
import { ValidatedRequest } from "express-joi-validation";
import { HttpStatusCode } from "axios";
import { sendMail } from '../utils/providers/mail/config';
import { successResult, errorResult } from '../utils/constants/results'
import { createPasswordHash, verifyPasswordHash } from '../utils/helpers/password.helper'
import messages from '../utils/constants/messages'
import userModel from '../models/user'
import { CheckMfas, LoginType, RegisterType } from '../types/auth.types';
import { randomBytes, randomInt } from 'crypto';
import { BaseStatusEnum, MfaEnum, MfaStatusEnum } from '../utils/constants/enums';
import userDistinctiveModel from '../models/userDistinctive';
import userMfaModel from '../models/userMfa';
import mfaLogModel from '../models/mfaLog';

//#region Logic of Auth
/* 

User'll enter mail and password --> it returns a distinctiveCode randomBytes(4).toString("hex")

With help of distinctiveCode, user get mfa/mfas (which options are selected from user)

User go to the getToken() type distinctiveCode-MFA code/codes

if all of them true, user get his/her token
and WRITE TRIGGER in the mongodb when expireDate is came status of distinctiveCode will be false!

*/
//#endregion

export const login = async (req: ValidatedRequest<LoginType>, res: Response, next: NextFunction) => {

    const email = req.body.email
    const password = req.body.password

    const user = await userModel.findOne({ email, status: BaseStatusEnum.Active })
        .catch((error: Error) => {
            console.error(error.message)
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    messages.user_couldnt_found
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

    const passwordVerification = await verifyPasswordHash(password, user.passwordHash, user.passwordSalt)
        .catch((error: Error) => {
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    error.message
                )
            )
        })

    if (!passwordVerification)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.user_wrong_password
            )
        )

    const userDistinctiveData = {
        user,
        code: randomBytes(4).toString("hex")
    }

    await userDistinctiveModel.create(userDistinctiveData)
        .catch((error: Error) => {
            console.error(error.message)
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    messages.userDistinctive_add_failed
                )
            )
        })


    const userMfas = await userMfaModel.find({ user: user._id, status: BaseStatusEnum.Active })
        .catch((error: Error) => {
            console.error(error.message)
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    messages.userMfa_couldnt_found
                )
            )
        })

    if (userMfas.length === 0)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.userMfa_couldnt_found
            )
        )

    for (let mfa of userMfas) {
        if (mfa.mfaType === MfaEnum.Email) {
            await sendEmailFunc(user.id, user.email, res)
        }
        else if (mfa.mfaType === MfaEnum.GoogleAuth) {
            // google auth implementation
        }
    }

    return res.status(HttpStatusCode.BadRequest).json(
        successResult(
            userDistinctiveData.code,
            messages.success
        )
    )
}

const sendEmailFunc = async (userId: string, userEmail: string, res: Response) => {
    let emailCode = randomInt(100000, 999999)

    sendMail(userEmail, "Login", `Email Code: ${emailCode}`)
    await mfaLogModel.create({
        user: userId,
        mfaType: MfaEnum.Email,
        dioristicCode: emailCode,
        status: MfaStatusEnum.NotUsed,
        expireDate: new Date().getMinutes() + 3
    })
        .catch((error: Error) => {
            console.error(error.message)
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    messages.userMfa_add_failed
                )
            )
        })
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
                .json(
                    errorResult(
                        null,
                        messages.user_add_failed
                    )
                );
        });

    const distinctiveCode = randomBytes(4).toString('hex');

    const distinctiveData = {
        user: user.id,
        code: distinctiveCode
    }

    await userDistinctiveModel.create(distinctiveData)
        .catch((error: Error) => {
            console.error(error);
            return res
                .status(HttpStatusCode.BadRequest)
                .json(
                    errorResult(
                        null,
                        messages.userDistinctive_add_failed
                    )
                )
        })

    return res
        .status(HttpStatusCode.Ok)
        .json(
            successResult(distinctiveCode, messages.success)
        )
}

// export const sendMfaCode = (req: Request, res: Response, next: NextFunction) => {

//     //send mfa code with help of type of mfa and send it after checking distinctive code
// }

export const checkMfas = async (req: ValidatedRequest<CheckMfas>, res: Response, next: NextFunction) => {

    const distinctiveCode = req.query.distinctiveCode

    const userDistinctive = await userDistinctiveModel.findOne({ code: distinctiveCode, status: BaseStatusEnum.Active }).populate("user")
        .catch((error: Error) => {
            console.error(error.message)
            return res.status(HttpStatusCode.BadRequest).json(
                errorResult(
                    null,
                    messages.error
                )
            )
        })

    if (!userDistinctive)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.userDistinctive_couldnt_find
            )
        )

    const user = await userModel.findOne(userDistinctive.user)
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