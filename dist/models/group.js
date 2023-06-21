"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../utils/constants/enums");
const groupSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    queue: {
        type: Number,
        required: true
    },
    boardId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Board',
        required: true
    },
    cards: [
        {
            card: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'Card',
                required: true
            }
        }
    ],
    status: {
        enum: enums_1.BaseStatusEnum,
        type: Number,
        required: true,
        default: enums_1.BaseStatusEnum.Active
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Group', groupSchema);
