import { timeStamp } from "node:console"
import { HTTP_STATUS } from "../constant/http_status.constant"
import { User } from "../database/Entity/user.entity"
import { ROLES } from "../enum/enums"
import { APIError, AuthenticationError } from "../exceptions/custom.exceptions"
import { IjwtData, Iorder } from "../interface/interfaces"
import { AddressRepository } from "../repository/address.repository"
import { ShopCartRepository } from "../repository/cart.repository"
import { CustomerRepository } from "../repository/customer.repository"
import { OrderRepository } from "../repository/order.repository"
import { ProductRepository } from "../repository/product.repository"
import { UserRepository } from "../repository/user.repository"


export class OrderService {

    private userRepo : UserRepository
    private orderRepo : OrderRepository
    private customerRepo : CustomerRepository
    private shopCartRepo : ShopCartRepository
    private productRepo : ProductRepository
    private addressRepo : AddressRepository

    constructor(){
        this.orderRepo = new OrderRepository()
        this.customerRepo = new CustomerRepository()
        this.shopCartRepo = new ShopCartRepository()
        this.productRepo = new ProductRepository()
        this.addressRepo = new AddressRepository()
        this.userRepo = new UserRepository()
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
                const order_item = await this.orderRepo.addOrderItems({
                    product_id : product.product_id,
                    price : fetched_product.price,
                    quantity : product.quantity
                }, order.order_id)
            }
            if(isCart){
                await this.shopCartRepo.deleteCartItem(isCart.cart_id, [...products.map((product) => {
                    return product.product_id
                })])
            }
        }
        else{
            const error = new APIError("please send the product to order", HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED.CODE)
            error.name = "ValidationError"
            throw error
        }    
    }

    public viewOrders = async () => {

    }

    public changeOrderState = async () => {

    }

    public deleteOrder = async () => {

    }
}