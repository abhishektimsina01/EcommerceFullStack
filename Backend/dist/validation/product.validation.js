"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productItemSchemaUpdate = exports.productItemSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const enums_1 = require("../enum/enums");
exports.productItemSchema = joi_1.default.object({
    product_name: joi_1.default.string()
        .trim()
        .required(),
    product_type: joi_1.default.string()
        .valid(...Object.values(enums_1.ITEM_CATEGORY))
        .required(),
    description: joi_1.default.string()
        .trim()
        .optional(),
    price: joi_1.default.number()
        .positive()
        .required(),
    stock: joi_1.default.number()
        .integer()
        .min(0)
        .required()
});
exports.productItemSchemaUpdate = joi_1.default.object({
    product_name: joi_1.default.string()
        .trim()
        .optional(),
    product_type: joi_1.default.string()
        .valid(...Object.values(enums_1.ITEM_CATEGORY))
        .optional(),
    description: joi_1.default.string()
        .trim()
        .optional(),
    price: joi_1.default.number()
        .positive()
        .optional(),
    stock: joi_1.default.number()
        .integer()
        .min(0)
        .optional()
}).min(1);
