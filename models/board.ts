import { Schema, model, SchemaTypes } from 'mongoose';
import { BaseStatusEnum } from '../utils/constants/enums';

const boardSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        coverImage: {
            type: String,
            required: false
        },
        visibilityTypeId: {
            type: SchemaTypes.ObjectId,
            ref: 'VisibilityType',
            required: true
        },
        members: [
            {
                userId: {
                    type: SchemaTypes.ObjectId,
                    ref: 'User',
                    required: true
                }
            }
        ],
        groups: [
            {
                group: {
                    type: SchemaTypes.ObjectId,
                    ref: 'Group',
                    required: true
                }
            }
        ],
        owner: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
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

export default model('Board', boardSchema);