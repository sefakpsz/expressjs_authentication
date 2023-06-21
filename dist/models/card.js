"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../utils/constants/enums");
const cardSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true
    },
    listId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'List',
        required: true
    },
    boardId: {
        type: mongoose_1.SchemaTypes.ObjectId,
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
        enum: enums_1.BaseStatusEnum,
        type: Number,
        required: true,
        default: enums_1.BaseStatusEnum.Active
    }
});
exports.default = new mongoose_1.Model('Card', cardSchema);
