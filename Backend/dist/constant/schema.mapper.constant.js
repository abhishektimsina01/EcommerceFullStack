"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupSchema = void 0;
const enums_1 = require("../enum/enums");
const auth_validation_1 = require("../validation/auth.validation");
exports.SignupSchema = {
    [enums_1.ROLES.CUSTOMER]: auth_validation_1.signUpCustomerSchema,
    [enums_1.ROLES.ADMIN]: auth_validation_1.signUpAdminScehma
};
