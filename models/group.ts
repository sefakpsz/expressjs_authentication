import { SchemaTypes, Schema, Model } from "mongoose";
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
            enum: BaseStatusEnum,
            type: Number,
            required: true,
            default: BaseStatusEnum.Active
        }
    },
    {
        timestamps: true
    })

export default new Model('Group', groupSchema);