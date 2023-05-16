import { Schema, SchemaTypes, Model } from 'mongoose'
import { MfaEnum, MfaStatusEnum } from '../utils/constants/enums';

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

export default new Model('MfaLog', mfaLogSchema);