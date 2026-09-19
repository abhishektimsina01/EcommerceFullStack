"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const connect_db_1 = require("../database/connect.db");
const admin_entity_1 = require("../database/Entity/admin.entity");
class AdminRepository {
    adminRepo;
    constructor() {
        this.adminRepo = connect_db_1.appDataSource.getRepository(admin_entity_1.Admin);
    }
    createAdmin = async (userId) => {
        const admin = this.adminRepo.create({
            user: {
                user_id: userId
            }
        });
        return await this.adminRepo.save(admin);
    };
    findAdmn = async (userId) => {
        return await this.adminRepo.findOne({
            where: {
                user: {
                    user_id: userId
                }
            }
        });
    };
}
exports.AdminRepository = AdminRepository;
