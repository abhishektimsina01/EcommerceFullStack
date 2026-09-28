import { HTTP_STATUS } from "../constant/http_status.constant"
import { User } from "../database/Entity/user.entity"
import { ORDER_STATUS, ROLES } from "../enum/enums"
import { APIError, AuthenticationError, AuthotizationError } from "../exceptions/custom.exceptions"
import { IjwtData, Iorder, IorderCustomer, IordersProvider, IsingleOrderCustomer } from "../interface/interfaces"
import { AddressRepository } from "../repository/address.repository"
import { ShopCartRepository } from "../repository/cart.repository"
import { CustomerRepository } from "../repository/customer.repository"
import { OrderRepository } from "../repository/order.repository"
import { ProductRepository } from "../repository/product.repository"
import { UserRepository } from "../repository/user.repository"
import { RoleHelper } from "../helper/role.helper"
import { Customer } from "../database/Entity/customer.entity"
import { redisClient } from "../config/redis.config"
import { Order } from "../database/Entity/order.entity"


export class OrderService {

    private userRepo : UserRepository
    private orderRepo : OrderRepository
    private customerRepo : CustomerRepository
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

        // snapshot a dedicated address row so a unique order.address_id index cannot block later orders
        let address_id : number
        if(orderData.current_address.address){
            const address = await this.addressRepo.addAddress(orderData.current_address.address)
            address_id = address.address_id
        }
        else{
            const user = await this.userRepo.findUser("user_id", userData.id) as User
            if(!user?.address){
                throw new APIError("no default address found", 400)
            }
            const snapshot = await this.addressRepo.addAddress({
                city : user.address.city,
                state : user.address.state,
                address_line : user.address.address_line || undefined,
                postal_code : user.address.postal_code || undefined
            })
            address_id = snapshot.address_id
        }

        // find the product
        const fetched_product = await this.productRepo.findProductItem("product_id", products.product_id, ROLES.ADMIN)
        if(!fetched_product){
            throw new AuthenticationError("NOT_FOUND", "product not found")
        }

        // check for the product
        console.log(products.quantity)
        console.log(fetched_product.stock)
        if(products.quantity > fetched_product.stock){
            // item out of the stock oh no!!
            throw new APIError("order failed", 404, {
                content : "quantity more than the stock"
            })
        }

        // create order
        const order = await this.orderRepo.createOrder(customer.customer_id, address_id, products.product_id, fetched_product.price, products.quantity)
        await this.productRepo.updateProduct(products.product_id, {
            stock : fetched_product.stock - products.quantity
        })
        if(isCart){
            await this.shopCartRepo.deleteCartItem(isCart.cart_id, products.product_id)
        }
        await redisClient.del(`viewOrder:${userData.id}`)
        await redisClient.del(`viewOrders:${userData.id}`)
        return order
    }

    public viewOrders = async (userData : IjwtData) => {
        if(this.roleHelper.isCustomer(userData.role)){
            const customer = await this.customerRepo.findCustomer("user", {
                user_id : userData.id
            }) as Customer

            // find the orders made by the customer
            const orders = await this.orderRepo.getOrders(customer.customer_id)
            let response : IorderCustomer[] = []
            for(let order of orders){
                const orderFormt : IorderCustomer= {
                    order_id : order.order_id,
                    price : order.price,
                    quantity : order.quantity,
                    status : order.status,
                    payment_id : order?.payment?.payment_id ?? null,
                    product : order.product
                }
                response.push(orderFormt)
            }
            return response 
        }
        // admin
        else if(this.roleHelper.isAdmin(userData.role)){
            const orders = await this.orderRepo.findAllOrder()
            return orders.map((order) => ({
                ...order,
                payment_id : order.payment?.payment_id ?? null
            }))
        }
    }
    
    public viewOrder = async (userData : IjwtData, order_id : number) => {
        let order : Order | null
        if(this.roleHelper.isCustomer(userData.role)){
            order = await this.orderRepo.findOrder("order_id", order_id)
        }
        else{
            order = await this.orderRepo.findOrderAdmin("order_id", order_id)
            }
        if(!order){
            const err = new APIError("error", 404)
            throw err
        }
        return {
            ...order,
            payment_id : order.payment?.payment_id ?? null,
            total : order.price * order.quantity
        }
    }

    public changeOrderState = async (userData : IjwtData, order_id : number, state : ORDER_STATUS) => {
        const order = await this.orderRepo.findOrder("order_id", order_id)
        if(!order){
            const err = new APIError("error", 404)
            throw err
        }
        if(this.roleHelper.isCustomer(userData.role)){
            if(order.status === ORDER_STATUS.PENDING && state === ORDER_STATUS.CANCELED){
                order.status = ORDER_STATUS.CANCELED
                return await this.orderRepo.orderRepo.save(order)
            }
            else{
                throw new AuthotizationError("NOT ALLOWED")
            }
        }
        else{
            if(state === ORDER_STATUS.CANCELED){
                if(order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.PROCESSING || order.status === ORDER_STATUS.CONFIRMED){
                    order.status = ORDER_STATUS.CANCELED
                    return await this.orderRepo.orderRepo.save(order)
                }
                else{
                    throw new AuthotizationError("NOT ALLOWED")
                }
            }
            else if(state === ORDER_STATUS.PROCESSING){
                if(order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED){
                    order.status = ORDER_STATUS.PROCESSING
                    return await this.orderRepo.orderRepo.save(order)
                }
            }
            else if(state === ORDER_STATUS.DELIVERED){
                if(order.status === ORDER_STATUS.PROCESSING){
                    order.status = ORDER_STATUS.DELIVERED
                    return await this.orderRepo.orderRepo.save(order)
                }
            }
            else{
                throw new AuthotizationError("NOT ALLOWED")
            }
        }
    }

    public deleteOrder = async (userData : IjwtData, order_id : number) => {
        const order = await this.orderRepo.findOrder("order_id", order_id)
        if(!order){
            throw new APIError("order was not found", 404)
        }
        await this.orderRepo.deleteOrder(order_id)
    }
}
