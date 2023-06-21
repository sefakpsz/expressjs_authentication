"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../utils/constants/enums");
const boardSchema = new mongoose_1.Schema({
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
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'VisibilityType',
        required: true
    },
    members: [
        {
            userId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ],
    groups: [
        {
            group: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'Group',
                required: true
            }
        }
    ],
    owner: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        enum: enums_1.BaseStatusEnum,
        type: Number,
        required: true,
        default: enums_1.BaseStatusEnum.Active
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Board', boardSchema);
