"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../utils/constants/enums");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    passwordSalt: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    boards: [
        {
            board: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'Board',
                required: false
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
exports.default = (0, mongoose_1.model)('User', userSchema);
