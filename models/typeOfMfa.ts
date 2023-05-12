import { Schema, model } from 'mongoose'
import { BaseStatusEnum } from '../utils/constants/enums';

const typeOfMfaSchema = new Schema(
    {
        title: {
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

export default model('TypeOfMfa', typeOfMfaSchema);