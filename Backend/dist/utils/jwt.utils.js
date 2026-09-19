"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getEnvPropery_utils_1 = require("./getEnvPropery.utils");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const signToken = (userData) => {
    // this is the data given to us after signUp or logIn
    const { id, username, role } = userData;
    const access_token = jsonwebtoken_1.default.sign({ id, username, role }, (0, getEnvPropery_utils_1.getEnvProperty)("access_token_secret_key"), {
        expiresIn: "1d"
    });
    const refresh_token = jsonwebtoken_1.default.sign({ id }, (0, getEnvPropery_utils_1.getEnvProperty)("refresh_token_secret_key"), {
        expiresIn: "1d"
    });
    return { access_token, refresh_token };
};
exports.signToken = signToken;
const verifyAccessToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, (0, getEnvPropery_utils_1.getEnvProperty)("access_token_secret_key"));
        return payload;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            // token is tampered or different
            console.log(err.name);
            throw new custom_exceptions_1.AuthenticationError("LOGIN", "token has altered");
        }
        else if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // token has been expired
            console.log(err.name);
            throw new custom_exceptions_1.AuthenticationError("REFRESH_TOKEN", "token has expired");
        }
        else if (err instanceof jsonwebtoken_1.default.NotBeforeError) {
            // token used before made active
            throw new custom_exceptions_1.AuthenticationError("TOKEN_USED_BEFORE_ACTIVE", "token is not ready to be used");
        }
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, (0, getEnvPropery_utils_1.getEnvProperty)("refresh_token_secret_key"));
        return payload;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            // token is tampered or different
            console.log(err.name);
            throw new custom_exceptions_1.AuthenticationError("LOGIN", "token has altered");
        }
        else if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // token has been expired
            console.log(err.name);
            throw new custom_exceptions_1.AuthenticationError("LOGIN", "token has expired");
        }
        else if (err instanceof jsonwebtoken_1.default.NotBeforeError) {
            // token used before made active
            throw new custom_exceptions_1.AuthenticationError("TOKEN_USED_BEFORE_ACTIVE", "token is not ready to be used");
        }
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
