"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_entity_1 = require("../database/Entity/user.entity");
const connect_db_1 = require("../database/connect.db");
class UserRepository {
    userRepo;
    constructor() {
        this.userRepo = connect_db_1.appDataSource.getRepository(user_entity_1.User);
    }
    findUser = async (key, value, is_password = false) => {
        const user = await this.userRepo.findOne({
            where: {
                [`${key}`]: value
            },
            select: {
                user_id: true,
                email: true,
                role: true,
                username: true,
                password: is_password,
                address: {
                    address_id: true,
                    city: true
                },
            },
            relations: {
                address: true
            }
        });
        return user;
    };
    createUser = async (userData) => {
        const user = this.userRepo.create({ ...userData });
        return await this.userRepo.save(user);
    };
    deleteAllUsers = async () => {
        const users = await this.userRepo.find();
        await this.userRepo.remove(users);
    };
}
exports.UserRepository = UserRepository;
