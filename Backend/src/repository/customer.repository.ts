import { Repository } from "typeorm";
import { Customer } from "../database/Entity/customer.entity";
import { appDataSource } from "../database/connect.db";

export class CustomerRepository {
    private customerRepo : Repository<Customer>

    constructor(){
        this.customerRepo = appDataSource.getRepository(Customer)
    }

    public findCustomer = async <T>(key : string, value : T) => {
        const customer = await this.customerRepo.findOne({
            where : {
                [`${key}`] : value
            },
            select : {
                customer_id : true,
                user : {
                    user_id : true
                }
            },
            relations : {
                user : true
            }
        })
        return customer
    }
    
    public createCustomer = async (userId : number) => {
        const customer = this.customerRepo.create({
            user : {
                user_id : userId
            }
        })
        return await this.customerRepo.save(customer)
    }
}