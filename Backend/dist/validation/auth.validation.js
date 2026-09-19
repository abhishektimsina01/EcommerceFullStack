"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpAdminScehma = exports.signUpCustomerSchema = exports.addressSchema = exports.loginScheam = void 0;
const joi_1 = __importDefault(require("joi"));
const enums_1 = require("../enum/enums");
exports.loginScheam = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).max(18).required()
});
exports.addressSchema = joi_1.default.object({
    city: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    postal_code: joi_1.default.string().optional(),
    address_line: joi_1.default.string().optional()
});
exports.signUpCustomerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).max(18).required(),
    username: joi_1.default.string().required(),
    phone_number: joi_1.default.string().pattern(/^(97|98)\d{8}$/).required(),
    address: exports.addressSchema.required(),
    role: joi_1.default.string().valid(...Object.values(enums_1.ROLES)).required(),
});
exports.signUpAdminScehma = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).max(18).required(),
    username: joi_1.default.string().required(),
    // store_name : Joi.string().required(),
    phone_number: joi_1.default.string().pattern(/^(97|98)\d{8}$/).required(),
    // opening_time: Joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/).required(),
    // closing_time: Joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/).required(),
    role: joi_1.default.string().valid(...Object.values(enums_1.ROLES)).required(),
    address: exports.addressSchema.required()
});
