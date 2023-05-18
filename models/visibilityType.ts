import { Model, Schema } from 'mongoose'
import { BaseStatusEnum } from '../utils/constants/enums'

const visibilityType = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
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
    })

export default new Model(`VisibilityType`, visibilityType)