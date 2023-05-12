import { Schema, SchemaTypes, model } from 'mongoose'
import { BaseStatusEnum } from '../utils/constants/enums';

const mfaLogSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
        mfaType: {
            type: SchemaTypes.ObjectId,
            ref: 'TypeOfMfa',
            required: true
        },
        dioristicCode: {
            type: String,
            required: true
        },
        status: {
            type: BaseStatusEnum,
            required: true,
            default: BaseStatusEnum.Active
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