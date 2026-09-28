import { Repository } from "typeorm"
import { User } from "../database/Entity/user.entity"
import { appDataSource } from "../database/connect.db"
import { IcustomerSignUp } from "../interface/interfaces"
import { userType } from "../types/types"

export class UserRepository {

    private userRepo : Repository<User>
    constructor(){
        this.userRepo = appDataSource.getRepository(User)
    }

    public findUser = async <T>(key : string, value : T, is_password : boolean = false) => {
        const user = await this.userRepo.findOne({
            where : {
                [`${key}`] : value
            },
            select : {
                user_id : true,
                email : true,
                role : true,
                username : true,
                password : is_password,
                address : {
                    address_id : true,
                    city : true,
                    state : true,
                    address_line : true,
                    postal_code : true,
                },
            },
            relations : {
                address : true
            }
        })
        return user
    }

    public createUser = async (userData : userType) => {
        const user = this.userRepo.create({...userData})   
        return await this.userRepo.save(user)
    }

    public deleteAllUsers = async () => {
        const users = await this.userRepo.find()
        await this.userRepo.remove(users)
    }
}