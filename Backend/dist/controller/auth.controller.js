"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLogOut = exports.authSignUp = exports.authLogIn = void 0;
const auth_validation_1 = require("../validation/auth.validation");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const response_utils_1 = require("../utils/response.utils");
const http_status_constant_1 = require("../constant/http_status.constant");
const auth_service_1 = require("../service/auth.service");
const cookies_utils_1 = require("../utils/cookies.utils");
const schema_mapper_constant_1 = require("../constant/schema.mapper.constant");
const authService = new auth_service_1.AuthService();
const authLogIn = async (req, res, next) => {
    try {
        const userData = req.body;
        const { error } = auth_validation_1.loginScheam.validate(userData);
        if (error) {
            throw new custom_exceptions_1.ValidationError(error);
        }
        const response = await authService.loginService(userData);
        const { access_token, refresh_token, ...safeData } = response;
        (0, cookies_utils_1.setCookies)(res, "access_token", access_token);
        (0, cookies_utils_1.setCookies)(res, "refresh_token", refresh_token);
        return (0, response_utils_1.sendAPIResponse)(res, "Logged In", http_status_constant_1.HTTP_STATUS.SUCCESS.OK.CODE, { ...safeData, access_token, refresh_token });
    }
    catch (err) {
        next(err);
    }
};
exports.authLogIn = authLogIn;
const authSignUp = async (req, res, next) => {
    try {
        const role = req.body.role;
        const { error } = schema_mapper_constant_1.SignupSchema[role].validate(req.body);
        if (error) {
            throw new custom_exceptions_1.ValidationError(error);
        }
        const response = await authService.signupService(req.body);
        const { access_token, refresh_token, ...safeData } = response;
        (0, cookies_utils_1.setCookies)(res, "access_token", access_token);
        (0, cookies_utils_1.setCookies)(res, "refresh_token", refresh_token);
        return (0, response_utils_1.sendAPIResponse)(res, "user regsitered", http_status_constant_1.HTTP_STATUS.SUCCESS.OK.CODE, response);
    }
    catch (err) {
        next(err);
    }
};
exports.authSignUp = authSignUp;
const authLogOut = (req, res, next) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return (0, response_utils_1.sendAPIResponse)(res, "Logged Out", 200);
};
exports.authLogOut = authLogOut;
