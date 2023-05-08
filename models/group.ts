import { SchemaTypes, Schema, model } from "mongoose";

const groupSchema = new Schema(
    {
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
    },
    {
        timestamps: true
    })

export default model('Group', groupSchema);