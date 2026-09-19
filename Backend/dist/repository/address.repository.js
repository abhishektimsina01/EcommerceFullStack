"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRepository = void 0;
const address_entity_1 = require("../database/Entity/address.entity");
const connect_db_1 = require("../database/connect.db");
class AddressRepository {
    addressRepo;
    constructor() {
        this.addressRepo = connect_db_1.appDataSource.getRepository(address_entity_1.Address);
    }
    addAddress = async (address) => {
        const new_address = this.addressRepo.create(address);
        return await this.addressRepo.save(new_address);
    };
    deleteAddress = async (addressId) => {
        await this.addressRepo.delete({
            address_id: addressId
        });
    };
}
exports.AddressRepository = AddressRepository;
