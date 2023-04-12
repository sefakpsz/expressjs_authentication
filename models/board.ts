import { Schema, Model, SchemaTypes } from 'mongoose';

const boardSchema = new Schema({
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
    }
})

module.exports = new Model('Board', boardSchema);