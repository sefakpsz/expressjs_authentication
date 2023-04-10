import { Schema, Model, SchemaTypes } from 'mongoose';

const boardSchema = new Schema({
    status: {
        type: Boolean,
        required: true
    },
    coverImage: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    visibilityTypeId: {
        type: SchemaTypes.ObjectId,
        ref: 'VisibilityType',
        required: true
    },
    users: [
        {
            userId: {
                type: SchemaTypes.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ],
    lists: [
        {
            list: {
                type: SchemaTypes.ObjectId,
                ref: 'List',
                required: true
            }
        }
    ],
    description: {
        type: String
    },
    ownerOfBoard: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = new Model('Board', boardSchema);