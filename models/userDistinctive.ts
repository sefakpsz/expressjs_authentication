import { Schema, SchemaTypes, model } from 'mongoose'

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
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: true
    });

export default model('UserDistinctive', userDistinctiveSchema);