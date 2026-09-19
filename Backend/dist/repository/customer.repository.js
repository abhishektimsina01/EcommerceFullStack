"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const customer_entity_1 = require("../database/Entity/customer.entity");
const connect_db_1 = require("../database/connect.db");
class CustomerRepository {
    customerRepo;
    constructor() {
        this.customerRepo = connect_db_1.appDataSource.getRepository(customer_entity_1.Customer);
    }
    findCustomer = async (key, value) => {
        const customer = await this.customerRepo.findOne({
            where: {
                [`${key}`]: value
            },
            select: {
                customer_id: true,
                user: {
                    user_id: true,
                },
            },
            relations: {
                user: true
            }
        });
        return customer;
    };
    createCustomer = async (userId) => {
        const customer = this.customerRepo.create({
            user: {
                user_id: userId
            }
        });
        return await this.customerRepo.save(customer);
    };
}
exports.CustomerRepository = CustomerRepository;
