import { Request, Response, NextFunction } from 'express';
import { ValidatedRequest } from "express-joi-validation";
import { HttpStatusCode } from "axios";
import { sendMail } from '../utils/providers/mail/config';
import { successResult, errorResult } from '../utils/constants/results'
import { createPasswordHash, verifyPasswordHash } from '../utils/helpers/password.helper'
import messages from '../utils/constants/messages'
import userModel from '../models/user'
import { CheckMfas, LoginType, RegisterType, ResetPassword, SendMailResetPass } from '../types/auth.types';
import { randomBytes, randomInt } from 'crypto';
import { BaseStatusEnum, MfaEnum, MfaStatusEnum } from '../utils/constants/enums';
import userDistinctiveModel from '../models/userDistinctive';
import userMfaModel from '../models/userMfa';
import { createToken, verifyToken } from '../utils/helpers/token.helper';

//#region Logic of Auth
/* 

User'll enter mail and password --> it returns a distinctiveCode randomBytes(4).toString("hex")

With help of distinctiveCode, user get mfa/mfas (which options are selected from user)

User go to the getToken() type distinctiveCode-MFA code/codes

if all of them true, user get his/her token
and 
(use hooks for that reason https://mongoosejs.com/docs/middleware.html#post-async)
WRITE TRIGGER in the mongodb when expireDate is came status of distinctiveCode will be false!

JWT

- Keep a global list of JWTs that have been revoked before they expired (and remove the tokens after expiry). 
    Instead of letting webservers hit a server to get this list, push the list to each server using a pub/sub mechanism.
- Revoking tokens is important for security, but rare. Realistically this list is small and easily fits into memory. 
    This largely solves the logout issue.

 payload{
    email: sefakapisiz@gmail.com,
    userId: encryptedPayload
 }
*/
//#endregion

export const login = async (req: ValidatedRequest<LoginType>, res: Response, next: NextFunction) => {

    const email = req.body.email
    const password = req.body.password

    const user = await userModel.findOne({ email, status: BaseStatusEnum.Active })

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.user_couldnt_found
            )
        )

    const passwordVerification = await verifyPasswordHash(password, user.passwordHash, user.passwordSalt)

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

    const userMfas = await userMfaModel.findOne({ user: user._id })

    if (userMfas?.mfaTypes.length === 0)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.userMfa_couldnt_found
            )
        )

    //It is not dynamic approach !!!
    userMfas?.mfaTypes.forEach(async mfa => {
        if (mfa.type === MfaEnum.Email) {
            await sendEmailFunc(user.email, "Login")
        }
        else if (mfa.type === MfaEnum.GoogleAuth) {
            // google auth implementation
        }
    })

    return res.status(HttpStatusCode.BadRequest).json(
        successResult(
            userDistinctiveData.code,
            messages.success
        )
    )
}

const sendEmailFunc = async (userEmail: string, subject: string) => {
    let emailCode = randomInt(100000, 999999)

    const date = new Date()
    await sendMail(userEmail, subject, `Email Code: ${emailCode}`)
    await userMfaModel.aggregate(
        [
            {
                $match: {
                    "mfa.name": MfaEnum.Email
                }
            },
            {
                $set: {
                    "mfa.code": emailCode,
                    "mfa.expireDate": date.setMinutes(date.getMinutes() + 5)
                }
            }
        ]
    )

    return { emailCode }
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

    const distinctiveCode = createDistinctiveCode();

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

const createDistinctiveCode = async () => {
    return randomBytes(4).toString('hex');
}

export const checkMfas = async (req: ValidatedRequest<CheckMfas>, res: Response, next: NextFunction) => {

    const { distinctiveCode, emailCode } = req.query

    const userDistinctive = await userDistinctiveModel.findOne({ code: distinctiveCode, status: BaseStatusEnum.Active }).populate("user")

    if (!userDistinctive)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.userDistinctive_couldnt_find
            )
        )

    const user = await userModel.findOne(userDistinctive.user)

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.user_couldnt_found
            )
        )

    const mfaDataOfUser = await userMfaModel.findOne(
        {
            user: user._id,
            "mfaTypes.status": BaseStatusEnum.Active
        }
    )

    mfaDataOfUser?.mfaTypes.forEach(mfaData => {
        if (mfaData.type === MfaEnum.Email) {
            if (mfaData.code !== emailCode) {
                return res.status(HttpStatusCode.BadRequest).json(
                    errorResult(null, messages.wrong_email_code)
                )
            } else if (mfaData.expireDate?.getMilliseconds() as number <= new Date().getMilliseconds()) {
                return res.status(HttpStatusCode.BadRequest).json(
                    errorResult(null, messages.expired_email_code)
                )
            }
        }
        // if google auth will be implemented
        // if(mfaData.type === MfaEnum.GoogleAuth){
        //     if(mfaData.code!==googleCode)
        // }
    })

    const token = createToken(user.id)
    await userDistinctiveModel.updateOne({ _id: userDistinctive.id }, { code: "" })

    return res.status(HttpStatusCode.Ok).json(
        successResult(token, messages.success)
    )
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    // enter email code, token, old&new password then and change password

    // token has to be for this scenerio

    const { oldPassword, newPassword } = req.body
    const { userId } = req.user

    const user = await userModel.findById(userId)

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.user_couldnt_found
            )
        )

    const verificationOfOldPassword = await verifyPasswordHash(oldPassword, user.passwordHash, user.passwordSalt);
    if (!verificationOfOldPassword)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_wrong_password)
        )

    const { hash, salt } = await createPasswordHash(newPassword)

    if (hash === user.passwordHash)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_same_password)
        )

    await userModel.updateOne({ _id: user.id }, { passwordHash: hash, passwordSalt: salt })

    return res.status(HttpStatusCode.Ok).json(
        successResult(null, messages.success)
    )
}

export const resetPassword = async (req: ValidatedRequest<ResetPassword>, res: Response, next: NextFunction) => {

    const { distinctiveCode, emailCode, newPassword } = req.body

    const userDistinctiveData = await userDistinctiveModel.findOne({ code: distinctiveCode })
    if (!userDistinctiveData)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.userDistinctive_code_wrong)
        )

    const userMfaData = await userMfaModel.findOne({ user: userDistinctiveData.user })
    if (!userMfaData)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.userMfa_couldnt_found)
        )

    if (userMfaData.mfaTypes.includes())

    /*
    get mail of user
    send mailCode to user via e-mail authorize to user
    and then with mail code, email and password reset to password
    */

}

export const sendMailResetPass = async (req: ValidatedRequest<SendMailResetPass>, res: Response, next: NextFunction) => {

    const { email } = req.query

    const user = await userModel.findOne({ email })

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_couldnt_found)
        )

    const emailData = await sendEmailFunc(email, "Password Resetting")

    const distinctiveCode = await createDistinctiveCode()

    await userDistinctiveModel.create({
        user: user,
        code: distinctiveCode,
    })


    return res.status(HttpStatusCode.Ok).json(
        successResult(emailData.emailCode, messages.success)
    )
}