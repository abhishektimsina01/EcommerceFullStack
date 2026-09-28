import { Between, LessThan, LessThanOrEqual, MoreThan } from "typeorm";
import { ITEM_CATEGORY } from "../enum/enums";
import { APIError } from "../exceptions/custom.exceptions";
import { RoleHelper } from "../helper/role.helper";
import { Ifilters, IjwtData, IproductItem } from "../interface/interfaces";
import { ProductRepository } from "../repository/product.repository";
import { extractKeysFromObj } from "../utils/checkKeyAndRetrieveValue";
import { uploader } from "../utils/cloudinary.utils";
import { UploadApiResponse } from "cloudinary";``
import { AdminRepository } from "../repository/admin.repository";
import { CustomerRepository } from "../repository/customer.repository";
import { OrderRepository } from "../repository/order.repository";
import { ShopCartRepository } from "../repository/cart.repository";


export class ProductService {
    private productRepo : ProductRepository
    private adminRepo : AdminRepository
    private roleHelper : RoleHelper
    private customerRepo : CustomerRepository
    private orderRepo : OrderRepository
    private shopCartRepo : ShopCartRepository

    constructor(){
        this.productRepo = new ProductRepository()
        this.roleHelper = new RoleHelper()
        this.adminRepo = new AdminRepository()
        this.customerRepo = new CustomerRepository()
        this.orderRepo = new OrderRepository()
        this.shopCartRepo = new ShopCartRepository()
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

    // per-user recommendation: nudge products in categories this customer has ordered
    // (weight 2) or has in their cart (weight 1) toward the top of the listing. Falls
    // back to the default order when the customer has no history / cannot be resolved.
    public getRecommendedProducts = async (userData : IjwtData, filters : Ifilters) => {
        const products = await this.getAllProducts(userData, filters)

        const customer = await this.customerRepo.findCustomer("user", {
            user_id : userData.id
        })
        if(!customer){
            return products
        }

        const affinity = new Map<ITEM_CATEGORY, number>()
        const orderedCategories = await this.orderRepo.getOrderedCategories(customer.customer_id)
        for(const category of orderedCategories){
            affinity.set(category, (affinity.get(category) ?? 0) + 2)
        }
        const cart = await this.shopCartRepo.findCart(customer.customer_id)
        if(cart){
            const items = await this.shopCartRepo.findCartItems(cart.cart_id)
            for(const item of items){
                const category = item.product_item?.product_type
                if(category){
                    affinity.set(category, (affinity.get(category) ?? 0) + 1)
                }
            }
        }

        if(affinity.size === 0){
            return products
        }

        // stable weighted sort: higher affinity first, original order kept within a tie
        return products
            .map((product, index) => ({ product, index }))
            .sort((a, b) => {
                const scoreA = affinity.get(a.product.product_type) ?? 0
                const scoreB = affinity.get(b.product.product_type) ?? 0
                if(scoreB !== scoreA){
                    return scoreB - scoreA
                }
                return a.index - b.index
            })
            .map((entry) => entry.product)
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
