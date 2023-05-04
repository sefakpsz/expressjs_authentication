import { Schema, SchemaTypes, Model } from 'mongoose'

const userSchema = new Schema({
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
        type: Boolean,
        required: true,
        default: true
    }
});

export default new Model('User', userSchema);