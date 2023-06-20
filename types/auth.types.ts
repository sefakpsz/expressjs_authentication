import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation'

export interface LoginType extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        email: string
        password: string
    }
}

export interface RegisterType extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
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

export interface ResetPassword extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        distinctiveCode: string,
        emailCode: Number,
        googleCode: Number,
        newPassword: string
    }
}

export interface CheckMfasPass extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        distinctiveCode: string,
        emailCode: string,
        newPassword: string
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