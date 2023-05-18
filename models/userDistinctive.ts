import { Schema, SchemaTypes, Model } from 'mongoose'
import { BaseStatusEnum } from '../utils/constants/enums';

const userDistinctiveSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
        code: {
            type: String,
            required: true
        },
        status: {
            enum: BaseStatusEnum,
            type: Number,
            required: true,
            default: BaseStatusEnum.Active
        }
    },
    {
        timestamps: true
    });

export default new Model('UserDistinctive', userDistinctiveSchema);