import { SchemaTypes, Schema, Model } from "mongoose";

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    queue: {
        type: Number,
        required: true
    },
    boardId: {
        type: SchemaTypes.ObjectId,
        ref: 'Board',
        required: true
    },
    cards: [
        {
            card: {
                type: SchemaTypes.ObjectId,
                ref: 'Card',
                required: true
            }
        }
    ]
})

module.exports = new Model('List', listSchema);