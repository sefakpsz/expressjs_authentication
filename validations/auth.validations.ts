import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

export const validator = createValidator({ passError: true });

const passwordRules = (value: string, helpers: any) => {
    // write your own password rules and add as below example
    // .custom(passwordRules).required();
}

export const Register = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    surname: Joi.string().required()
});

export const CheckMfas = Joi.object({
    distinctiveCode: Joi.string().required(),
    //check distinctive code and MFAs
});

export const SendMfaCode = Joi.object({
    code: Joi.string().required()
});

export const Login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const ChangePassword = Joi.object({
    token: Joi.string().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

export const ResetPassword = Joi.object({
    email: Joi.string().email().required()
});