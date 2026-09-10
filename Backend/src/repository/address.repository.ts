import { Repository } from "typeorm";
import { Address } from "../database/Entity/address.entity";
import { appDataSource } from "../database/connect.db";
import { Iaddress } from "../interface/interfaces";

export class AddressRepository {

    private addressRepo : Repository<Address>

    constructor(){
        this.addressRepo = appDataSource.getRepository(Address)
    }
    
    public addAddress = async (address : Iaddress) => {
        const new_address = this.addressRepo.create(address)
        return await this.addressRepo.save(new_address)
    }
}