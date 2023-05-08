import { model, Schema } from 'mongoose'

const visibilityTypes = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    })

export default model(`VisibilityTypes`, visibilityTypes)