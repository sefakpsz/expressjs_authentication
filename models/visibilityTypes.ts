import { model, Schema } from 'mongoose'
import { BaseStatusEnum } from '../utils/constants/enums'

const visibilityTypes = new Schema(
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
            type: BaseStatusEnum,
            required: true,
            default: BaseStatusEnum.Active
        }
    },
    {
        timestamps: true
    })

export default model(`VisibilityTypes`, visibilityTypes)