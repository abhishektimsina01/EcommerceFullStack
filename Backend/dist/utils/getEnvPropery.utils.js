"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvProperty = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
dotenv_1.default.config();
const getEnvProperty = (key) => {
    if (Object.hasOwn(process.env, key)) {
        const value = process.env[key];
        if (value != "" && value != undefined) {
            return value;
        }
    }
    throw new custom_exceptions_1.APIError("no env key found", 404);
};
exports.getEnvProperty = getEnvProperty;
