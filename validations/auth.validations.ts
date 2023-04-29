import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

export const validator = createValidator({ passError: false });

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

export const Login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const PasswordChange = Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

export const PasswordReset = Joi.object({
    email: Joi.string().email().required()
});