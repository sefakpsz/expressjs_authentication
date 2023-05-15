import { Schema, SchemaTypes, model } from 'mongoose'
import { BaseStatusEnum, MfaEnum } from '../utils/constants/enums';

const userMfas = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
        mfaType: {
            type: MfaEnum,
            required: true
        },
        status: {
            type: BaseStatusEnum,
            required: true,
            default: BaseStatusEnum.Active
        }
    },
    {
        timestamps: true
    });

export default model('UserMfas', userMfas);