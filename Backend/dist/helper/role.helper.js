"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleHelper = void 0;
const enums_1 = require("../enum/enums");
class RoleHelper {
    isAdmin = (role) => {
        return (role === enums_1.ROLES.ADMIN) ? true : false;
    };
    isCustomer = (role) => {
        return (role === enums_1.ROLES.CUSTOMER) ? true : false;
    };
}
exports.RoleHelper = RoleHelper;
