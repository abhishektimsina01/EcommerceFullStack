import { ROLES } from "../enum/enums";
import { AuthenticationError } from "../exceptions/custom.exceptions";
import { IjwtData, ILogIn, IproductItem, IproviderSignUp } from "../interface/interfaces";
import { consoleQueue } from "../queue/queue";
import { AddressRepository } from "../repository/address.repository";
import { AdminRepository } from "../repository/admin.repository";
import { CustomerRepository } from "../repository/customer.repository";
import { ProviderRepository } from "../repository/provider.repository";
import { UserRepository } from "../repository/user.repository";
import { providerType, signUpType } from "../types/types";
import { signToken } from "../utils/jwt.utils";
import { comparePassword, hashPassword } from "../utils/password.utils";

export class AuthService {

    private userRepo : UserRepository
    private addressRepo : AddressRepository
    private customerRepo : CustomerRepository
    private providerRepo : ProviderRepository
    private adminRepo : AdminRepository

    constructor(){
        this.userRepo = new UserRepository()
        this.addressRepo = new AddressRepository()
        this.customerRepo = new CustomerRepository()
        this.providerRepo = new ProviderRepository()
        this.adminRepo = new AdminRepository()
    }

    public loginService = async (userData : ILogIn) => { 
        const {email, password} = userData
        const user = await this.userRepo.findUser("email", email, true)
        if(!user){
            throw new AuthenticationError("USER_NOT_FOUND", "user_not_found")
        }
        const isSame = await comparePassword(password, user.password)
        if(!isSame){
            throw new AuthenticationError("LOGIN_FAILED", "credentials failed")
        }
        const data : IjwtData= {
            id : user.user_id,
            username : user.username,
            role : user.role
        }
        const {access_token, refresh_token} = signToken(data)
        await consoleQueue.add("console", data)
        return {
            ...data,
            access_token, 
            refresh_token
        }
    }

    public signupService = async( userData : signUpType) => {
        const {username, email, password, role, phone_number, address, ...otherData} = userData  
        let safeData = {}
        // await this.userRepo.deleteAllUsers()
        const isUser = await this.userRepo.findUser("email", email)
        if(isUser){
            throw new AuthenticationError("ALREADY_EXIST", "user already exist")
        }
        const added_address = await this.addressRepo.addAddress(address)
        const address_id = added_address.address_id
        const hashedPassword = await hashPassword(password)
        const userPayoad = {
            username,
            email,
            password : hashedPassword,
            role, 
            phone_number,
            address : {
                address_id : address_id
            }
        }
        // user making
        const user = await this.userRepo.createUser(userPayoad)
        const {access_token, refresh_token} = signToken({
            id : user.user_id,
            username : user.username,
            role : user.role
        })
        
        // consumer
        if(user.role == ROLES.CUSTOMER){
            const customer = await this.customerRepo.createCustomer(user.user_id)
            safeData =  {
                user_id : user.user_id,
                username : user.username,
                customer_id : customer.customer_id
            }
        }
        // admin
        else{
            const admin = await this.adminRepo.createAdmin(user.user_id)
            safeData =  {
                user_id : user.user_id,
                username : user.username,
                admin_id : admin.admin_id
            }
        }
        return {
            ...safeData,
            access_token,
            refresh_token
        }
    }
}