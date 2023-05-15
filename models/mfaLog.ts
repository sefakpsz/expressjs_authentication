import { Schema, SchemaTypes, model } from 'mongoose'
import { BaseStatusEnum, MfaEnum, MfaStatusEnum } from '../utils/constants/enums';

const mfaLogSchema = new Schema(
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
        dioristicCode: {
            type: String,
            required: true
        },
        status: {
            type: MfaStatusEnum,
            required: true,
            default: MfaStatusEnum.NotUsed
        },
        expireDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    });

export default model('MfaLog', mfaLogSchema);