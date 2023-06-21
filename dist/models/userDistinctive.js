"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../utils/constants/enums");
const userDistinctiveSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true
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
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('UserDistinctive', userDistinctiveSchema);
