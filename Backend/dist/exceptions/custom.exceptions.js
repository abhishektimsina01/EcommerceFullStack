"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryError = exports.ValidationError = exports.DatabaseError = exports.AuthotizationError = exports.AuthenticationError = exports.APIError = void 0;
const http_status_constant_1 = require("../constant/http_status.constant");
class APIError extends Error {
    statusCode;
    details;
    constructor(message, statusCode, details = null) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.APIError = APIError;
class AuthenticationError extends APIError {
    constructor(name, message) {
        super(message, http_status_constant_1.HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED.CODE);
        this.name = name;
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthotizationError extends APIError {
    constructor(message) {
        super(message, http_status_constant_1.HTTP_STATUS.CLIENT_ERROR.FORBIDDEN.CODE);
        this.name = "UNAUTHORIZED";
    }
}
exports.AuthotizationError = AuthotizationError;
class DatabaseError extends APIError {
    constructor(message) {
        super(message, http_status_constant_1.HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST.CODE);
        this.name = "DATA_QUERY_ERROR";
    }
}
exports.DatabaseError = DatabaseError;
class ValidationError extends APIError {
    constructor(error) {
        super("Validation error", http_status_constant_1.HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST.CODE, {
            content: error.message,
            cause: error.cause,
            message: error.details[0].message
        });
    }
}
exports.ValidationError = ValidationError;
class QueryError extends APIError {
    constructor(err) {
        super("Failed to perform the operation", http_status_constant_1.HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST.CODE, {
            ...err
        });
        this.name = err.name;
    }
}
exports.QueryError = QueryError;
