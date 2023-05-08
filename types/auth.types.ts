import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation'

export interface LoginType extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        email: string;
        password: string;
    };
}

export interface RegisterType extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        email: string;
        password: string;
        name: string;
        surname: string;
    };
}

//ask it to osman
// export interface RegisterType extends ValidatedRequestSchema {
//     [ContainerTypes.Body]: {
//         email: string;
//     };
// }