import { Model, Schema, SchemaTypes } from 'mongoose'
import { BaseStatusEnum, MfaEnum } from '../utils/constants/enums';

const userMfaSchema = new Schema(
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

export default new Model('UserMfa', userMfaSchema);