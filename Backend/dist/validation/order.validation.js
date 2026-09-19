"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const auth_validation_1 = require("./auth.validation");
const productItem = joi_1.default.object({
    product_id: joi_1.default.number().positive().min(1).required(),
    quantity: joi_1.default.number().positive().min(1).required()
});
exports.orderSchema = joi_1.default.object({
    product: productItem.required(),
    current_address: joi_1.default.object({
        address: auth_validation_1.addressSchema.optional(),
        default_address: joi_1.default.bool().optional()
    }).min(1).max(1).required()
});
