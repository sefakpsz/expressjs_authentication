import { SchemaTypes, Schema, Model } from "mongoose";
import { BaseStatusEnum } from "../utils/constants/enums";

const cardSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    listId: {
        type: SchemaTypes.ObjectId,
        ref: 'List',
        required: true
    },
    boardId: {
        type: SchemaTypes.ObjectId,
        ref: 'Board',
        required: true
    },
    color: {
        type: String,
        required: false
    },
    coverImage: {
        type: String,
        required: false
    },
    attachment: {
        type: String,
        required: false
    },
    comments: [
        {
            comment: {
                description: {
                    type: String,
                    required: false
                },
                createdDate: {
                    type: Date,
                    required: false
                }
            }
        }
    ],
    status: {
        type: BaseStatusEnum,
        required: true,
        default: BaseStatusEnum.Active
    }
})

export default new Model('Card', cardSchema);