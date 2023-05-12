import { Schema, SchemaTypes, model } from 'mongoose'
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
            type: BaseStatusEnum,
            required: true,
            default: BaseStatusEnum.Active
        }
    },
    {
        timestamps: true
    });

export default model('UserDistinctive', userDistinctiveSchema);