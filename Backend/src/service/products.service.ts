import { Between, LessThan, LessThanOrEqual, MoreThan } from "typeorm";
import { ITEM_CATEGORY } from "../enum/enums";
import { APIError } from "../exceptions/custom.exceptions";
import { RoleHelper } from "../helper/role.helper";
import { Ifilters, IjwtData, IproductItem } from "../interface/interfaces";
import { ProductRepository } from "../repository/product.repository";
import { ProviderRepository } from "../repository/provider.repository";
import { extractKeysFromObj } from "../utils/checkKeyAndRetrieveValue";
import { uploader } from "../utils/cloudinary.utils";
import { UploadApiResponse } from "cloudinary";
import { AdminRepository } from "../repository/admin.repository";


export class ProductService {
    private providerRepo : ProviderRepository
    private productRepo : ProductRepository
    private adminRepo : AdminRepository
    private roleHelper : RoleHelper

    constructor(){
        this.productRepo = new ProductRepository()
        this.roleHelper = new RoleHelper()
        this.providerRepo = new ProviderRepository()
        this.adminRepo = new AdminRepository()
    }

    public getProductService = async (userData : IjwtData, productId : number) => {
        const role = userData.role
        const isProduct = await this.productRepo.checkProductItem(productId)
        if(!isProduct){
            const err =  new APIError("product couldnot be found", 404)
            throw err
        }
        else{
            const product = await this.productRepo.findProductItem("product_id", productId, role)
            return product
        }
    }

    public createProduct = async (userData : IjwtData, productData : IproductItem, path : string | null = null) => {
        if(path){
            // const cloud_path : UploadApiResponse = await uploader(path)
            // productData.product_image = cloud_path.secure_url
            productData.product_image = path ?? "image"
        }
        const productItem = await this.productRepo.createProduct(productData)
        return productItem
    }

    public getAllProducts = async (userData : IjwtData, filters : Ifilters) => {
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

    public deleteProduct = async (userData : IjwtData, productId : number) => {
        const product = await this.productRepo.checkProductItem(productId)
        if(!product){
            const error =  new APIError("not found", 404)
            error.name = "NOT_FOUND"
            throw error
        }
        await this.productRepo.deleteProduct(productId)
    }

    public updateProduct = async (userData : IjwtData, productId : number, productData : Partial<IproductItem>) => {
        const product = await this.productRepo.checkProductItem(productId)
        if(!product){
            const error =  new APIError("not found", 404)
            error.name = "NOT_FOUND"
            throw error
        }
        const updatePayload = extractKeysFromObj(productData, ["product_name", "product_type", "description", "price", "stock"])
        const updatedProducts = await this.productRepo.updateProduct(productId, updatePayload)
        return updatedProducts
    }
}