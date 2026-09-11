import { Repository } from "typeorm";
import { Product } from "../database/Entity/product.entity";
import { appDataSource } from "../database/connect.db";
import { Ifilters, IjwtData, IproductItem } from "../interface/interfaces";
import { ROLES } from "../enum/enums";
import { ResturantProjection } from "../constant/project.constant";


export class ProductRepository {

    private productRepo : Repository<Product>

    constructor(){
        this.productRepo = appDataSource.getRepository(Product)
    }

    public checkProductItem = async (product_id : number) => {
        return await this.productRepo.exists({
            where : {
                product_id : product_id
            }
        })
    }

    public findProductItem = async <T>(key : string, value : T, role : ROLES) => {
        return await this.productRepo.findOne({
            where : {
                [`${key}`] : value
            },
            ...ResturantProjection[role as Exclude<ROLES, ROLES.ADMIN>]
        })
    }

    public createProduct = async (provider_id : number, productData : IproductItem) => {
        const product = this.productRepo.create({
            ...productData,
            provider : {
                provider_id : provider_id
            }
        })
        return await this.productRepo.save(product)
    }

    public findAllProductsProvider = async (provider_id : number) => {
            return this.productRepo.find({
                where : {
                    provider : {
                        provider_id : provider_id
                    }
                },
                select : {
                    product_id : true,
                    product_name : true,
                    price : true,
                    product_image : true,
                    product_type : true
                }
            })
    }

    public findAllProducts = async (userData : IjwtData, where : any = {}) => {
            return this.productRepo.find({
                where : {
                    ...where,
                },
                select : {
                    product_id : true,
                    product_name : true,
                    product_type : true,
                    product_image : true,
                    price : true
                }
        })
    }

    public deleteProduct = async ( productId : number ) => {
        const product = await this.productRepo.findOne({
            where : {
                product_id : productId
            }
        })
        await this.productRepo.remove(product as Product)
    }

    public deleteAllProducts = async () => {
        const products = await this.productRepo.find()
        await this.productRepo.remove(products)
    }

    public updateProduct = async (productId : number, productData : Partial<IproductItem>) => {
        await this.productRepo.update({
            product_id : productId
        },{
            ...productData
        })
        const product = await this.findProductItem("product_id", productId, ROLES.PROVIDER)
        return product as Product
    }
}