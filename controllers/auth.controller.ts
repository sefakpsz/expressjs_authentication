import { Request, Response, NextFunction } from 'express';
import { ValidatedRequest } from "express-joi-validation";
import { HttpStatusCode } from "axios";
import { sendMail } from '../utils/providers/mail/config';
import { successResult, errorResult } from '../utils/constants/results'
import { createPasswordHash, verifyPasswordHash } from '../utils/helpers/password.helper'
import messages from '../utils/constants/messages'
import userModel from '../models/user'
import { CheckMfas, LoginType, RegisterType, ResetPassword, CheckMfasPass } from '../types/auth.types';
import { randomBytes, randomInt } from 'crypto';
import { BaseStatusEnum, MfaEnum, MfaStatusEnum } from '../utils/constants/enums';
import userDistinctiveModel from '../models/userDistinctive';
import userMfaModel from '../models/userMfa';
import { createToken, verifyToken } from '../utils/helpers/token.helper';
import { Types } from 'mongoose';

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

    const email = req.query.email
    const password = req.query.password

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
        code: randomBytes(4).toString("hex"),
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

    //It is not dynamic approach !!!
    userMfas?.mfaTypes.forEach(async mfa => {
        if (mfa.type === MfaEnum.Email) {
            await sendEmailFunc(user.id, user.email, "Login")
        }
        else if (mfa.type === MfaEnum.GoogleAuth) {
            // google auth implementation
        }
    })

    return res.status(HttpStatusCode.BadRequest).json(
        successResult(
            { DistinctiveCode: userDistinctiveData.code },
            messages.success
        )
    )
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

export const logout = (req: Request, res: Response, next: NextFunction) => {
    // AFTER FINISHING REDIS TOKEN SIDE

    /*
    via token go to user's token info and make expire prop to true and write current datetime to updatedAt
     */
}

export const register = async (req: ValidatedRequest<RegisterType>, res: Response, next: NextFunction) => {

    const { email, password, name, surname } = req.query

    const isEmailExists = await userModel.findOne({ email, status: true })
    if (isEmailExists)
        return res
            .status(HttpStatusCode.BadRequest)
            .json(errorResult(null, messages.user_already_exists))

    const passwordHashAndSalt = await createPasswordHash(password);

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
            user.id = data.id;
        })


    await userMfaModel.create({
        user: user.id,
        mfaTypes: [{ type: MfaEnum.Email }]
    })

    return res
        .status(HttpStatusCode.Ok)
        .json(
            successResult(true, messages.success)
        )
}

const createDistinctiveCode = async () => {
    return randomBytes(5).toString('hex');
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

    if (userDistinctive.expireDate < Date.now())
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.expired_distinctive_code)
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

    if (!mfaDataOfUser)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.userMfa_couldnt_found)
        )

    for (let mfaData of mfaDataOfUser?.mfaTypes) {
        if (mfaData.type === MfaEnum.Email) {
            if (mfaData.code.toString() !== emailCode.toString()) {
                return res.status(HttpStatusCode.BadRequest).json(
                    errorResult(null, messages.wrong_email_code)
                )
            } else if (mfaData.expireDate <= Date.now()) {
                return res.status(HttpStatusCode.BadRequest).json(
                    errorResult(null, messages.expired_email_code)
                )
            }
            mfaData.code = 0
            mfaData.expireDate = 0
        }
        // if google auth will be implemented
        // if(mfaData.type === MfaEnum.GoogleAuth){
        //     if(mfaData.code!==googleCode)
        // }
    }
    await mfaDataOfUser.save();

    const token = createToken(user.id)

    return res.status(HttpStatusCode.Ok).json(
        successResult(token, messages.success)
    )
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.query
    const user = req.user


    const verificationOfOldPassword = await verifyPasswordHash(oldPassword as string, user.passwordHash as string, user.passwordSalt as string);
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

export const forgotPassword = async (req: ValidatedRequest<ResetPassword>, res: Response, next: NextFunction) => {

    const { distinctiveCode, emailCode, newPassword } = req.query

    const userDistinctiveData = await userDistinctiveModel.findOne({ code: distinctiveCode })
    if (!userDistinctiveData)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.userDistinctive_couldnt_find)
        )

    if (userDistinctiveData.expireDate < Date.now())
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.expired_distinctive_code)
        )

    const user = await userModel.findById(userDistinctiveData.user)

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_couldnt_found)
        )

    const userMfaData = await userMfaModel.findOne({ user })
    if (!userMfaData)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.userMfa_couldnt_found)
        )

    // with a loop make here dynamic, and don't forget to user prop of status
    if (userMfaData.mfaTypes[0].expireDate < Date.now())
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.expired_email_code)
        )
    else if (userMfaData.mfaTypes[0].code !== emailCode)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.wrong_email_code)
        )

    const { hash, salt } = await createPasswordHash(newPassword)

    if (hash === user.passwordHash)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_same_password)
        )

    await userModel.updateOne({ _id: user.id }, { passwordHash: hash, passwordSalt: salt })

    return res.status(HttpStatusCode.Ok).json(
        successResult(true, messages.user_password_updated)
    )
}

export const sendEmailPass = async (req: ValidatedRequest<CheckMfasPass>, res: Response, next: NextFunction) => {

    const { email } = req.query

    const user = await userModel.findOne({ email })

    if (!user)
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(null, messages.user_couldnt_found)
        )

    await sendEmailFunc(user.id, email as string, "Forgetten Password")

    const distinctiveCode = await createDistinctiveCode()

    await userDistinctiveModel.updateOne(
        { user },
        { code: distinctiveCode }
    )

    return res.status(HttpStatusCode.Ok).json(
        successResult(distinctiveCode, messages.success)
    )
}