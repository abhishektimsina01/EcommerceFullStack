"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const jwt_utils_1 = require("../utils/jwt.utils");
const user_repository_1 = require("../repository/user.repository");
const userRepo = new user_repository_1.UserRepository();
const authenticate = async (req, res, next) => {
    try {
        // try to access the token from the cookie
        const { access_token } = req.cookies;
        if (!access_token) {
            throw new custom_exceptions_1.AuthenticationError("LOGIN", "no token found please login");
        }
        const payload = (0, jwt_utils_1.verifyAccessToken)(access_token);
        const user = await userRepo.findUser("user_id", payload.id);
        if (!user) {
            throw new custom_exceptions_1.AuthenticationError("USER_NOT_FOUND", "no user was found");
        }
        req.user = {
            id: payload.id,
            username: payload.username,
            role: payload.role
        };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            if (roles.includes(req.user.role)) {
                next();
            }
            else {
                const err = new custom_exceptions_1.AuthotizationError(`${req.user.role} not authorized`);
                throw err;
            }
        }
        catch (err) {
            next(err);
        }
    };
};
exports.authorize = authorize;
