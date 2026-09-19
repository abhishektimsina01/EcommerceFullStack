"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const response_utils_1 = require("../utils/response.utils");
const notFound = (req, res, next) => {
    const detail = [{
            endpoint: req.originalUrl,
            method: req.method,
            message: "not found"
        }];
    const err = new custom_exceptions_1.APIError("Page not found", 404, detail);
    err.name = "PAGE_NOT_FOUND";
    next(err);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, next) => {
    console.log("error occurred❌");
    return (0, response_utils_1.sendErrorResponse)(res, err.name, err.message, err.statusCode, err.details);
};
exports.errorHandler = errorHandler;
