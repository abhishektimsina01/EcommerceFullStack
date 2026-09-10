import { Repository } from "typeorm";
import { appDataSource } from "../database/connect.db";
import { providerType } from "../types/types";
import { Provider } from "../database/Entity/provider.entity";


export class ProviderRepository {
    private providerRepo : Repository<Provider>

    constructor(){
        this.providerRepo = appDataSource.getRepository(Provider)
    }

    public createProvider = async (providerData : providerType) => {
        const provider = this.providerRepo.create({
            ...providerData
        })
        return await this.providerRepo.save(provider)
    }

    public findOneProvider = async <T>(key : string, value : T) => {
        const provider = await this.providerRepo.findOne({
            where : {
                [`${key}`] : value
            },
            select : {
                provider_id : true,
                store_name : true,
                status : true,
            }
        })
        return provider
    }
}