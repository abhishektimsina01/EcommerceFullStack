import { Repository } from "typeorm";
import { appDataSource } from "../database/connect.db";
import { Admin } from "../database/Entity/admin.entity";


export class AdminRepository {

    private adminRepo : Repository<Admin>
    constructor(){
        this.adminRepo = appDataSource.getRepository(Admin)
    }

    public createAdmin = async (userId : number) => {
        const admin = this.adminRepo.create({
            user : {
                user_id : userId
            }
        })
        return await this.adminRepo.save(admin)
    }

    public findAdmn = async (userId : number) => {
        return await this.adminRepo.findOne({
            where : {
                user : {
                    user_id : userId
                }
            }
        })
    }
}