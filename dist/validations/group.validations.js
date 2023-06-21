"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const express_joi_validation_1 = require("express-joi-validation");
exports.validator = (0, express_joi_validation_1.createValidator)({ passError: true });
