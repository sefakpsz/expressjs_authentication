import { Request, Response } from 'express'
import { ValidatedRequest } from "express-joi-validation"
import { HttpStatusCode } from "axios"
import { sendMail } from '../utils/providers/mail/config'
import { successResult, errorResult } from '../utils/constants/results'
import { createPasswordHash, verifyPasswordHash } from '../utils/helpers/password.helper'
import messages from '../utils/constants/messages'
import userModel from '../models/user'
import { ChangePassword, CheckMfas, LoginType, RegisterType, ResetPassword, SendEmail } from '../types/auth.types'
import { randomBytes, randomInt } from 'crypto'
import { BaseStatusEnum, MailOperations, MfaEnum } from '../utils/constants/enums'
import userDistinctiveModel from '../models/userDistinctive'
import userMfaModel from '../models/userMfa'
import { createToken } from '../utils/helpers/token.helper'
import { Types } from 'mongoose'
import { clearUserSession, clearUserSessions, setUserSession } from '../utils/helpers/session.helper'

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

export const login = async (req: ValidatedRequest<LoginType>, res: Response) => {

    const { email, password } = req.body

    const user = await userModel.findOne({ email, status: BaseStatusEnum.Active })

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.user_couldnt_found
            )
        )

    const passwordVerification = await verifyPasswordHash(password, user.passwordHash as string, user.passwordSalt as string)

    if (!passwordVerification)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.user_wrong_password
            )
        )

    const userDistinctiveData = {
        user,
        code: await createDistinctiveCode(),
        expireDate: new Date().setMinutes(new Date().getMinutes() + 5)
    }

    const userDistinctiveFromDb = await userDistinctiveModel.findOne({ user: user.id })

    if (userDistinctiveFromDb)
        await userDistinctiveModel.updateOne({ _id: userDistinctiveFromDb.id }, { code: userDistinctiveData.code, expireDate: userDistinctiveData.expireDate })
    else
        await userDistinctiveModel.create(userDistinctiveData)

    const userMfas = await userMfaModel.findOne({ user: user._id })

    if (userMfas?.mfaTypes.length === 0)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                messages.userMfa_couldnt_found
            )
        )

    return res.status(HttpStatusCode.BadRequest).json(
        successResult(
            { distinctiveCode: userDistinctiveData.code },
            messages.success
        )
    )
}

export const logout = async (req: Request, res: Response) => {
    const userId = req.user._id.toString()

    await clearUserSession(req, userId)

    return res.status(HttpStatusCode.Ok).json(
        successResult(null, messages.success)
    )
}

export const register = async (req: ValidatedRequest<RegisterType>, res: Response) => {

    const { email, password, name, surname } = req.body

    const isEmailExists = await userModel.findOne({ email, status: true })
    if (isEmailExists)
        return res
            .status(HttpStatusCode.BadRequest)
            .json(errorResult(null, messages.user_already_exists))

    const passwordHashAndSalt = await createPasswordHash(password)

    const user = {
        id: "",
        email,
        passwordHash: passwordHashAndSalt.hash,
        passwordSalt: passwordHashAndSalt.salt,
        name,
        surname
    }

    await userModel.create(user)
        .then(data => {
            user.id = data.id
        })


    await userMfaModel.create({
        user: user.id,
        mfaTypes: [{ type: MfaEnum.Email }]
    })

    return res
        .status(HttpStatusCode.Ok)
        .json(
            successResult(null, messages.success)
        )
}

export const checkMfas = async (req: ValidatedRequest<CheckMfas>, res: Response) => {
    const { distinctiveCode, emailCode, googleCode } = req.body

    const userDistinctive = await userDistinctiveModel.findOne({ code: distinctiveCode, status: BaseStatusEnum.Active }).populate("user")
    if (!userDistinctive)
        return errorResult(
            null,
            messages.userDistinctive_couldnt_find
        )

    if (userDistinctive.expireDate < Date.now())
        return errorResult(null, messages.expired_distinctive_code)


    const user = await userModel.findById(userDistinctive.user)
    if (!user)
        return errorResult(
            null,
            messages.user_couldnt_found
        )

    const mfaResult = await checkMfaCodes(emailCode, googleCode, user.id)

    if (!mfaResult?.success)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, mfaResult?.message as string)
        )

    const token = createToken(user.id)

    await setUserSession(req, user.id, token)

    return res.status(HttpStatusCode.Ok).json(
        successResult({ token }, messages.success)
    )
}

export const changePassword = async (req: ValidatedRequest<ChangePassword>, res: Response) => {
    const { oldPassword, newPassword } = req.body
    const user = req.user

    const verificationOfOldPassword = await verifyPasswordHash(oldPassword as string, user.passwordHash as string, user.passwordSalt as string)
    if (!verificationOfOldPassword)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_wrong_password)
        )

    const { hash, salt } = await createPasswordHash(newPassword as string)

    if (hash === user.passwordHash)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_same_password)
        )

    await userModel.updateOne({ _id: user._id }, { passwordHash: hash, passwordSalt: salt })

    return res.status(HttpStatusCode.Ok).json(
        successResult(null, messages.success)
    )
}

export const forgotPassword = async (req: ValidatedRequest<ResetPassword>, res: Response) => {
    const { email, emailCode, googleCode, newPassword } = req.body

    const user = await userModel.findOne({ email })
    if (!user)
        return errorResult(
            null,
            messages.user_couldnt_found
        )

    const mfaResult = await checkMfaCodes(emailCode, googleCode, user.id)

    if (!mfaResult?.success)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, mfaResult?.message as string)
        )

    await clearUserSessions(user.id)

    const { hash, salt } = await createPasswordHash(newPassword)

    if (hash === user.passwordHash)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_same_password)
        )

    await userModel.updateOne({ _id: user.id }, { passwordHash: hash, passwordSalt: salt })

    await clearUserSessions(user.id)

    return res.status(HttpStatusCode.Ok).json(
        successResult(null, messages.user_password_updated)
    )
}

export const sendEmail = async (req: ValidatedRequest<SendEmail>, res: Response) => {
    const { email, operation } = req.body

    const user = await userModel.findOne({ email })
    if (!user)
        return errorResult(
            null,
            messages.user_couldnt_found
        )

    if (!user)
        return errorResult(null, messages.user_couldnt_found)

    switch (operation) {
        case MailOperations.Login:
            await sendEmailFunc(user?.id, user?.email as string, "Login")
            break

        case MailOperations.ForgotPassword:
            await sendEmailFunc(user?.id, user?.email as string, "Forgotten Password")
            break

        default:
            break
    }

    return res.status(HttpStatusCode.Ok).json(
        successResult(null, messages.success)
    )
}


const createDistinctiveCode = async () => {
    return randomBytes(5).toString('hex')
}

const sendEmailFunc = async (userId: String, email: String, subject: String) => {
    let emailCode = randomInt(100000, 999999)

    const date = new Date()
    await sendMail(email as string, subject as string, `Email Code: ${emailCode}`)
    await userMfaModel.updateOne(
        {
            user: new Types.ObjectId(userId as string),
            "mfaTypes.type": MfaEnum.Email,
        },
        {
            $set: {
                "mfaTypes.$.code": emailCode,
                "mfaTypes.$.expireDate": date.setMinutes(date.getMinutes() + 5)
            },
        },
    )

    return { emailCode }
}

const checkMfaCodes = async (emailCode: Number, googleCode: Number, userId: string) => {

    const mfaDataOfUser = await userMfaModel.findOne(
        {
            user: userId,
            "mfaTypes.status": BaseStatusEnum.Active
        }
    )

    if (!mfaDataOfUser)
        return errorResult(null, messages.userMfa_couldnt_found)

    for (let mfa of mfaDataOfUser.mfaTypes) {
        switch (mfa.type) {
            case MfaEnum.Email:
                {
                    if (mfa.code !== emailCode)
                        return errorResult(null, messages.wrong_email_code)
                }
                break
            case MfaEnum.GoogleAuth:
                {
                    if (mfa.code !== googleCode)
                        return errorResult(null, messages.wrong_google_code)
                }
                break

            default:
                break
        }

        if (mfa.expireDate < Date.now())
            return errorResult(null, messages.expired_code)
    }

    return successResult(null, messages.success)
}