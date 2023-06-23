import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation'

export interface LoginType extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        email: string
        password: string
    }
}

export interface RegisterType extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        email: string
        password: string
        name: string
        surname: string
    }
}

export interface CheckMfas extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        distinctiveCode: string,
        emailCode: Number,
        googleCode: Number
    }
}

export interface ChangePassword extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        emailCode: string,
        googleCode: Number,
        oldPassword: string,
        newPassword: string
    }
}

export interface ResetPassword extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        email: string,
        emailCode: Number,
        googleCode: Number,
        newPassword: string
    }
}

export interface SendEmail extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        email: string,
        operation: number
    }
}

export interface IUser {
    _id: String,
    passwordHash: String,
    passwordSalt: String,
    name: String,
    surname: String,
    email: String,
    boards: [],
    status: Number
}

export interface IRedisResult {
    token: string
    expireDate: string
}