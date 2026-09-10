import { Between, LessThan, LessThanOrEqual, MoreThan } from "typeorm";
import { ITEM_CATEGORY } from "../enum/enums";
import { APIError, AuthenticationError, AuthotizationError } from "../exceptions/custom.exceptions";
import { RoleHelper } from "../helper/role.helper";
import { Ifilters, IjwtData, IproductItem } from "../interface/interfaces";
import { ProductRepository } from "../repository/product.repository";
import { ProviderRepository } from "../repository/provider.repository";
import { extractKeysFromObj } from "../utils/checkKeyAndRetrieveValue";


export class ProductService {
    private providerRepo : ProviderRepository
    private productRepo : ProductRepository
    private roleHelper : RoleHelper

    constructor(){
        this.productRepo = new ProductRepository()
        this.roleHelper = new RoleHelper()
        this.providerRepo = new ProviderRepository()
    }

    public getProductService = async (userData : IjwtData, productId : number) => {
        const role = userData.role
        const isProduct = await this.productRepo.checkProductItem(productId)
        if(!isProduct){
            const err =  new APIError("product couldnot be found", 404)
            throw err
        }
        if(this.roleHelper.isCustomer(role) || this.roleHelper.isAdmin(role)){
            const product = await this.productRepo.findProductItem("product_id", productId, role)
            return product
        }

        else if(this.roleHelper.isProvider(role)){
            const providerData = await this.providerRepo.findOneProvider("user", { user_id : true })
            if(!providerData){
                throw new AuthenticationError("PROVIDER_NOT_FOUND", "provider was not found")
            }
            const product = await this.productRepo.findProductItem("provider", { provider_id : providerData.provider_id}, role)
            if(!product){
                throw new AuthotizationError("you cannot access the product")
            }
            return product
        }
    }

    public createProduct = async (userData : IjwtData, productData : IproductItem) => {
        const provider = await this.providerRepo.findOneProvider("user", {
            user_id : userData.id
        })
        if(!provider){
            throw new AuthenticationError("PROVIDER_NOT_FOUND", "the provider was not found")
        }
        const productItem = await this.productRepo.createProduct(provider.provider_id as number, productData)
        return productItem
    }   

    public getAllProducts = async (userData : IjwtData, filters : Ifilters) => {
        if(this.roleHelper.isProvider(userData.role)){
            const products = await this.productRepo.findAllProductsProvider(userData)
            return products
        }
        else if(this.roleHelper.isCustomer(userData.role)){
            let where : any = {}
            const {product_type, max, min, stock} = filters
            if(product_type != undefined && Object.values(ITEM_CATEGORY).includes(product_type)){
                where.product_type = product_type
            }
            if(max != undefined && min !=undefined){
                where.price = Between(min, max)
            }
            else if(min != undefined){
                where.price = MoreThan(min)
            }
            else if(max != undefined){
                where.price = LessThan(max)
            }
            else{
                
            }
            if(stock != undefined){
                where.stock = LessThanOrEqual(stock)
            }

            const products = await this.productRepo.findAllProducts(userData, where)
            return products
        }
    }

    public deleteProduct = async (userData : IjwtData, productId : number) => {
        const products = await this.productRepo.findAllProductsProvider(userData)
        const DoesContain = products.some((product) => {
            if(product.product_id == productId){
                return true
            }
        })
        if(!DoesContain){
            const error =  new APIError("not found", 404)
            error.name = "NOT_FOUND"
            throw error
        }
        await this.productRepo.deleteProduct(productId)
    }

    public updateProduct = async (userData : IjwtData, productId : number, productData : Partial<IproductItem>) => {
        const products = await this.productRepo.findAllProductsProvider(userData)
        const DoesContain = products.some((product) => {
            if(product.product_id == productId){
                return true
            }
        })
        if(!DoesContain){
            const error =  new APIError("not found", 404)
            error.name = "NOT_FOUND"
            throw error
        }
        const updatePayload = extractKeysFromObj(productData, ["product_name", "product_type", "description", "price", "stock"])
        const updatedProducts = await this.productRepo.updateProduct(productId, updatePayload)
        return updatedProducts
    }
}