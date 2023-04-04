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
        types: String,
        required: true
    },
    visibilityTypeId: {
        types: SchemaTypes.ObjectId,
        ref: 'VisibilityType',
        required: true
    },
    membersOfBoard: [
        {
            userId: {
                types: SchemaTypes.ObjectId,
                ref: 'User',
                required: true
            },
            numberOfMember: {
                types: Number,
                required: true
            }
        }
    ]
    // products: [
    //     {
    //         productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    //         quantity: { type: Number, required: true }
    //     }
    // ],
    // userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
})

module.exports = new Model('Board', boardSchema);