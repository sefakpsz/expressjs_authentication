"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../utils/constants/enums");
const userMfaSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    mfaTypes: [
        {
            type: {
                enum: enums_1.MfaEnum,
                type: Number,
                required: true
            },
            code: {
                type: Number,
                default: 0
            },
            expireDate: {
                type: Number,
                default: 0
            },
            status: {
                enum: enums_1.BaseStatusEnum,
                type: Number,
                required: true,
                default: enums_1.BaseStatusEnum.Active
            }
        }
    ],
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('UserMfa', userMfaSchema);
