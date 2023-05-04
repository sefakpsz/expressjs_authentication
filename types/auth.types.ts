import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation'

export interface LoginType extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        email: string;
        password: string;
        name: string;
        surname: string;
    };
}