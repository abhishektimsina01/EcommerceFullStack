"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// this constant contains HTTP code and message for the response.
exports.HTTP_STATUS = {
    SUCCESS: {
        OK: {
            CODE: http_status_codes_1.default.OK,
            MESSAGE: 'Request successful.',
        },
        CREATED: {
            CODE: http_status_codes_1.default.CREATED,
            MESSAGE: 'Resource created successfully.',
        },
        NO_CONTENT: {
            CODE: http_status_codes_1.default.NO_CONTENT,
            MESSAGE: 'Request successful. No content to return.',
        },
    },
    CLIENT_ERROR: {
        BAD_REQUEST: {
            CODE: http_status_codes_1.default.BAD_REQUEST,
            MESSAGE: 'Bad request.',
        },
        UNAUTHORIZED: {
            CODE: http_status_codes_1.default.UNAUTHORIZED,
            MESSAGE: 'Authentication required.',
        },
        FORBIDDEN: {
            CODE: http_status_codes_1.default.FORBIDDEN,
            MESSAGE: 'You do not have permission to perform this action.',
        },
        NOT_FOUND: {
            CODE: http_status_codes_1.default.NOT_FOUND,
            MESSAGE: 'Resource not found.',
        },
        METHOD_NOT_ALLOWED: {
            CODE: http_status_codes_1.default.METHOD_NOT_ALLOWED,
            MESSAGE: 'HTTP method is not allowed.',
        },
        CONFLICT: {
            CODE: http_status_codes_1.default.CONFLICT,
            MESSAGE: 'Request conflicts with the current state of the resource.',
        },
        UNPROCESSABLE_ENTITY: {
            CODE: http_status_codes_1.default.UNPROCESSABLE_ENTITY,
            MESSAGE: 'Validation failed.',
        },
        TOO_MANY_REQUESTS: {
            CODE: http_status_codes_1.default.TOO_MANY_REQUESTS,
            MESSAGE: 'Too many requests. Please try again later.',
        },
    },
    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: {
            CODE: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            MESSAGE: 'Internal server error.',
        },
        NOT_IMPLEMENTED: {
            CODE: http_status_codes_1.default.NOT_IMPLEMENTED,
            MESSAGE: 'This functionality is not implemented.',
        },
        BAD_GATEWAY: {
            CODE: http_status_codes_1.default.BAD_GATEWAY,
            MESSAGE: 'Bad gateway.',
        },
        SERVICE_UNAVAILABLE: {
            CODE: http_status_codes_1.default.SERVICE_UNAVAILABLE,
            MESSAGE: 'Service temporarily unavailable.',
        },
        GATEWAY_TIMEOUT: {
            CODE: http_status_codes_1.default.GATEWAY_TIMEOUT,
            MESSAGE: 'Gateway timeout.',
        },
    },
};
