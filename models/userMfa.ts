import { model, Schema, SchemaTypes } from 'mongoose'
import { BaseStatusEnum, MfaEnum } from '../utils/constants/enums';

const userMfaSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
        mfaTypes: [
            {
                type: {
                    enum: MfaEnum,
                    type: Number,
                    required: true
                },
                code: {
                    type: Number
                },
                expireDate: {
                    type: Date
                },
                status: {
                    enum: BaseStatusEnum,
                    type: Number,
                    required: true,
                    default: BaseStatusEnum.Active
                }
            }
        ],
    },
    {
        timestamps: true
    });

export default model('UserMfa', userMfaSchema);