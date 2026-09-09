import HttpStatus from "http-status-codes"

// this constant contains HTTP code and message for the response.
export const HTTP_STATUS = {
    SUCCESS: {
        OK: {
            CODE: HttpStatus.OK,
            MESSAGE: 'Request successful.',
        },
        CREATED: {
            CODE: HttpStatus.CREATED,
            MESSAGE: 'Resource created successfully.',
        },
        NO_CONTENT: {
            CODE: HttpStatus.NO_CONTENT,
            MESSAGE: 'Request successful. No content to return.',
        },
    },

    CLIENT_ERROR: {
        BAD_REQUEST: {
            CODE: HttpStatus.BAD_REQUEST,
            MESSAGE: 'Bad request.',
        },
        UNAUTHORIZED: {
            CODE: HttpStatus.UNAUTHORIZED,
            MESSAGE: 'Authentication required.',
        },
        FORBIDDEN: {
            CODE: HttpStatus.FORBIDDEN,
            MESSAGE: 'You do not have permission to perform this action.',
        },
        NOT_FOUND: {
            CODE: HttpStatus.NOT_FOUND,
            MESSAGE: 'Resource not found.',
        },
        METHOD_NOT_ALLOWED: {
            CODE: HttpStatus.METHOD_NOT_ALLOWED,
            MESSAGE: 'HTTP method is not allowed.',
        },
        CONFLICT: {
            CODE: HttpStatus.CONFLICT,
            MESSAGE: 'Request conflicts with the current state of the resource.',
        },
        UNPROCESSABLE_ENTITY: {
            CODE: HttpStatus.UNPROCESSABLE_ENTITY,
            MESSAGE: 'Validation failed.',
        },
        TOO_MANY_REQUESTS: {
            CODE: HttpStatus.TOO_MANY_REQUESTS,
            MESSAGE: 'Too many requests. Please try again later.',
        },
    },

    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: {
            CODE: HttpStatus.INTERNAL_SERVER_ERROR,
            MESSAGE: 'Internal server error.',
        },
        NOT_IMPLEMENTED: {
            CODE: HttpStatus.NOT_IMPLEMENTED,
            MESSAGE: 'This functionality is not implemented.',
        },
        BAD_GATEWAY: {
            CODE: HttpStatus.BAD_GATEWAY,
            MESSAGE: 'Bad gateway.',
        },
        SERVICE_UNAVAILABLE: {
            CODE: HttpStatus.SERVICE_UNAVAILABLE,
            MESSAGE: 'Service temporarily unavailable.',
        },
        GATEWAY_TIMEOUT: {
            CODE: HttpStatus.GATEWAY_TIMEOUT,
            MESSAGE: 'Gateway timeout.',
        },
    },
} as const;