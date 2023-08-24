import { Schema, SchemaTypes, model } from 'mongoose'
import { BaseStatusEnum } from '../utils/constants/enums';
import { IUser } from '../types/auth.types';

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        passwordSalt: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        boards: [
            {
                board: {
                    type: SchemaTypes.ObjectId,
                    ref: 'Board',
                    required: false
                }
            }
        ],
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

export default model('User', userSchema)