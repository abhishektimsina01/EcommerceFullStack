"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAPIResponse = exports.sendErrorResponse = void 0;
const sendErrorResponse = (res, name, message, statusCode, details) => {
    return res.status(statusCode).json({
        error: true,
        name: name,
        message: message,
        details: details
    });
};
exports.sendErrorResponse = sendErrorResponse;
const sendAPIResponse = (res, message, statusCode, details = null) => {
    return res.status(statusCode).json({
        error: false,
        message: message,
        details: details
    });
};
exports.sendAPIResponse = sendAPIResponse;
