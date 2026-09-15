import { HTTP_STATUS } from "../constant/http_status.constant"
import { User } from "../database/Entity/user.entity"
import { ORDER_STATUS, ROLES } from "../enum/enums"
import { APIError, AuthenticationError } from "../exceptions/custom.exceptions"
import { IjwtData, Iorder, IorderCustomer, IordersProvider, IsingleOrderCustomer } from "../interface/interfaces"
import { AddressRepository } from "../repository/address.repository"
import { ShopCartRepository } from "../repository/cart.repository"
import { CustomerRepository } from "../repository/customer.repository"
import { OrderRepository } from "../repository/order.repository"
import { ProductRepository } from "../repository/product.repository"
import { UserRepository } from "../repository/user.repository"
import { RoleHelper } from "../helper/role.helper"
import { ProviderRepository } from "../repository/provider.repository"
import { Customer } from "../database/Entity/customer.entity"
import { Provider } from "../database/Entity/provider.entity"
import { redisClient } from "../config/redis.config"


export class OrderService {

    private userRepo : UserRepository
    private orderRepo : OrderRepository
    private customerRepo : CustomerRepository
    private providerRepo : ProviderRepository
    private shopCartRepo : ShopCartRepository
    private productRepo : ProductRepository
    private addressRepo : AddressRepository
    private roleHelper : RoleHelper

    constructor(){
        this.orderRepo = new OrderRepository()
        this.customerRepo = new CustomerRepository()
        this.shopCartRepo = new ShopCartRepository()
        this.productRepo = new ProductRepository()
        this.addressRepo = new AddressRepository()
        this.userRepo = new UserRepository()
        this.providerRepo = new ProviderRepository()
        this.roleHelper = new RoleHelper()
    }

    public makeOrder = async (userData : IjwtData, orderData : Iorder) => {
        const products = orderData.product
        const customer = await this.customerRepo.findCustomer("user", {
            user_id : userData.id
        })
        if(!customer){
            throw new AuthenticationError("CUSTOMER_NOT_FOUND", "no customer was found")
        }
        const isCart = await this.shopCartRepo.findCart(customer.customer_id)
        if(products.length != 0){
            let address_id : number
            if(orderData.current_address.address){
                const address = await this.addressRepo.addAddress(orderData.current_address.address)
                address_id = address.address_id
            }
            else{
                const user = await this.userRepo.findUser("user_id", userData.id) as User
                address_id = user.address.address_id
            }
            const order = await this.orderRepo.createOrder(customer.customer_id, address_id)
            for(let product of products){
                const fetched_product = await this.productRepo.findProductItem("product_id", product.product_id, ROLES.PROVIDER)
                if(!fetched_product){
                    throw new AuthenticationError("NOT_FOUND", "product not found")
                }
                if(product.quantity > fetched_product.stock){
                    // item out of the stock oh no!!!
                    await this.orderRepo.deleteOrder(order.order_id)
                    throw new APIError("order failed", 404, {
                        content : "quantity more than the stock"
                    })
                }
                await this.orderRepo.addOrderItems({
                    product_id : product.product_id,
                    price : fetched_product.price,
                    quantity : product.quantity
                }, order.order_id)
                await this.productRepo.updateProduct(product.product_id, {
                    stock : fetched_product.stock - product.quantity
                })
            }
            if(isCart){
                await this.shopCartRepo.deleteCartItem(isCart.cart_id, [...products.map((product) => {
                    return product.product_id
                })])
            }
            await redisClient.del(`viewOrder:${userData.id}`)

        }
        else{
            const error = new APIError("please send the product to order", HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED.CODE)
            error.name = "ValidationError"
            throw error
        }    
    }

    public viewOrders = async (userData : IjwtData) => {
        if(this.roleHelper.isCustomer(userData.role)){
            if(await redisClient.exists(`viewOrder:${userData.id}`) != 0){
                return await redisClient.get(`viewOrder:${userData.id}`)
            }
            const customer = await this.customerRepo.findCustomer("user", {
                user_id : userData.id
            }) as Customer
            const orders = await this.orderRepo.getOrders(customer.customer_id)
            let response : IorderCustomer[] = []
            for(let order of orders){
                const orderFormt : IorderCustomer= {
                    order_id : order.order_id,
                    status : order.status,
                    payment_id : order?.payment?.payment_id ?? null,
                    items : order.items
                }
                response.push(orderFormt)
            }
            await redisClient.set(`viewOrders:${userData.id}`, JSON.stringify(response))
            return response 
        }
        else if(this.roleHelper.isProvider(userData.role)){
            const provider = await this.providerRepo.findOneProvider("user", {
                user_id : userData.id
            }, true) as Provider
            const product_ids : number[] = provider.products.map((product) => {
                return product.product_id
            })
            const orderedItems = await this.orderRepo.getOrderItem(product_ids)
            // grouping the orders
            let orders : Record<number, IordersProvider> = {}
            let orderIds : number[] = []
            for(let item of orderedItems){
                if(orderIds.includes(item.order.order_id)){
                    // items in this order already found
                    orders[item.order.order_id].product.push({
                        item_id : item.item_id,
                        price : item.price,
                        quantity : item.quantity,
                        product_id : item.product.product_id,
                        description : item.product.description,
                        product_name : item.product.product_name,
                        product_image : item.product.product_image
                    })
                }
                else{
                    // items in this order not found so add them
                    orders[item.order.order_id] = {
                        order_id : item.order.order_id,
                        status : item.order.status,
                        cutomer : {
                            customer_id : item.order.customer.customer_id,
                            username : item.order.customer.user.username
                        },
                        payment_id : item.order?.payment?.payment_id ?? null,
                        product : [{
                            item_id : item.item_id,
                            price : item.price,
                            quantity : item.quantity,
                            product_id : item.product.product_id,
                            description : item.product.description,
                            product_name : item.product.product_name,
                            product_image : item.product.product_image
                        }]
                    }
                    }
                    orderIds.push(item.order.order_id)
                }
                return Object.values(orders)
            }
        }
    
    public viewOrder = async (userData : IjwtData, order_id : number) => {
        const order = await this.orderRepo.findOrder("order_id", order_id )
        if(!order){
            const err = new APIError("order not found", 404)
            err.name = "ORDER_NOT_FOUND"
            throw err
        }
        let managedOrder : IsingleOrderCustomer = {
            order_id : order.order_id,
            address : order.address,
            status : order.status,
            payment_id : order.payment.payment_id,
            total : 0,
            items : []
        }
        let totalSum = 0 
        for(let item of order.items){
            let itemData = {
                item_id : item.item_id,
                sub_total : item.price * item.quantity,
                product_id : item.product.product_id,
                product_image : item.product.product_image,
                product_name : item.product.product_name,
                description : item.product.description
            }
            totalSum += itemData.sub_total
            managedOrder.total = totalSum
            managedOrder.items.push(itemData)
        }
    }

    public changeOrderState = async (userData : IjwtData) => {
        
    }

    public deleteOrder = async (userData : IjwtData, order_id : number) => {
        const order = await this.orderRepo.findOrder("order_id", order_id)
        if(!order){
            const err =  new APIError("order was not found", 404)
            err.name = "ORDER_NOT_FOUND"
        }
        await this.orderRepo.deleteOrder(order_id)
    }
}