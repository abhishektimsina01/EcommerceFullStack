"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const enums_1 = require("../enum/enums");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const queue_1 = require("../queue/queue");
const address_repository_1 = require("../repository/address.repository");
const admin_repository_1 = require("../repository/admin.repository");
const customer_repository_1 = require("../repository/customer.repository");
const user_repository_1 = require("../repository/user.repository");
const jwt_utils_1 = require("../utils/jwt.utils");
const password_utils_1 = require("../utils/password.utils");
class AuthService {
    userRepo;
    addressRepo;
    customerRepo;
    adminRepo;
    constructor() {
        this.userRepo = new user_repository_1.UserRepository();
        this.addressRepo = new address_repository_1.AddressRepository();
        this.customerRepo = new customer_repository_1.CustomerRepository();
        this.adminRepo = new admin_repository_1.AdminRepository();
    }
    loginService = async (userData) => {
        const { email, password } = userData;
        const user = await this.userRepo.findUser("email", email, true);
        if (!user) {
            throw new custom_exceptions_1.AuthenticationError("USER_NOT_FOUND", "user_not_found");
        }
        const isSame = await (0, password_utils_1.comparePassword)(password, user.password);
        if (!isSame) {
            throw new custom_exceptions_1.AuthenticationError("LOGIN_FAILED", "credentials failed");
        }
        const data = {
            id: user.user_id,
            username: user.username,
            role: user.role
        };
        const { access_token, refresh_token } = (0, jwt_utils_1.signToken)(data);
        await queue_1.consoleQueue.add("console", data);
        return {
            ...data,
            access_token,
            refresh_token
        };
    };
    signupService = async (userData) => {
        const { username, email, password, role, phone_number, address, ...otherData } = userData;
        let safeData = {};
        // await this.userRepo.deleteAllUsers()
        const isUser = await this.userRepo.findUser("email", email);
        if (isUser) {
            throw new custom_exceptions_1.AuthenticationError("ALREADY_EXIST", "user already exist");
        }
        const added_address = await this.addressRepo.addAddress(address);
        const address_id = added_address.address_id;
        const hashedPassword = await (0, password_utils_1.hashPassword)(password);
        const userPayoad = {
            username,
            email,
            password: hashedPassword,
            role,
            phone_number,
            address: {
                address_id: address_id
            }
        };
        // user making
        const user = await this.userRepo.createUser(userPayoad);
        const { access_token, refresh_token } = (0, jwt_utils_1.signToken)({
            id: user.user_id,
            username: user.username,
            role: user.role
        });
        // consumer
        if (user.role == enums_1.ROLES.CUSTOMER) {
            const customer = await this.customerRepo.createCustomer(user.user_id);
            safeData = {
                user_id: user.user_id,
                username: user.username,
                customer_id: customer.customer_id
            };
        }
        // admin
        else {
            const admin = await this.adminRepo.createAdmin(user.user_id);
            safeData = {
                user_id: user.user_id,
                username: user.username,
                admin_id: admin.admin_id
            };
        }
        return {
            ...safeData,
            access_token,
            refresh_token
        };
    };
}
exports.AuthService = AuthService;
