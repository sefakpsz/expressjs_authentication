import { SchemaTypes, Schema, model } from "mongoose";
import { BaseStatusEnum } from "../utils/constants/enums";

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
        ],
        status: {
            type: BaseStatusEnum,
            required: true,
            default: BaseStatusEnum.Active
        }
    },
    {
        timestamps: true
    })

export default model('Group', groupSchema);