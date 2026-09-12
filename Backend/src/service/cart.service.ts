import { ShopCartRepository } from "../repository/cart.repository";
import { ProductRepository } from "../repository/product.repository";
import { AuthenticationError } from "../exceptions/custom.exceptions";
import { IjwtData } from "../interface/interfaces";
import { CustomerRepository } from "../repository/customer.repository";
import { ShopCart } from "../database/Entity/shop_cart.entity";

export class ShopCartService {

    private shopCartRepo : ShopCartRepository
    private productRepo : ProductRepository
    private customerRepo : CustomerRepository
    

    constructor(){
        this.shopCartRepo = new ShopCartRepository()
        this.productRepo = new ProductRepository()
        this.customerRepo = new CustomerRepository()
    }

    public addItemToCart = async (userData : IjwtData, productId : number) => {
        const product = await this.productRepo.checkProductItem(productId)
        if(!product){
            throw new AuthenticationError("PRODUCT_NOT_FOUND", "there is no product")
        }
        const customer = await this.customerRepo.findCustomer("user", {
            user_id : userData.id
        })
        if(!customer){
            throw new AuthenticationError("CUSTOMER_NOT_FOUND", "there is no customer")
        }
        const customerId = customer.customer_id

        const cart = await this.shopCartRepo.findCart(customerId)
        let cartId = cart?.cart_id
        if(!cart){
            const new_cart = await this.shopCartRepo.createCart(customerId)
            cartId = new_cart.cart_id
        }
        else{
            const itemsInCart = await this.shopCartRepo.findCartItems(cartId as number)
            const containsProduct = itemsInCart.some((item) => {
                if(item.product_item.product_id === productId){
                    return true
                }
            })
            if(containsProduct){
                return {}
            }
        }

        const cartItem = await this.shopCartRepo.addItemInCart(cartId as number, productId)
        return cartItem
    }

    public getAllShopCartItem = async (userData : IjwtData) => {
        const customer = await this.customerRepo.findCustomer('user', {
            user_id : userData.id
        })
        if(!customer){
            throw new AuthenticationError("NPT_FOUND", "the customer was not found")
        }
        const customerId = customer.customer_id

        const customerCart = await this.shopCartRepo.findCart(customerId)
        let cartId = customerCart?.cart_id
        if(!customerCart){
            const newCart = await this.shopCartRepo.createCart(customerId)
            cartId = newCart.cart_id
        }

        const addedItem = await this.shopCartRepo.findCartItems(cartId as number)
        return addedItem
    }

    public deleteCartItem = async (userData : IjwtData, itemId : number[]) => {
        const customer = await this.customerRepo.findCustomer("user", {
            user_id : userData.id
        })
        if(!customer){
            throw new AuthenticationError("NPT_FOUND", "the customer was not found")
        }
        const customerId = customer.customer_id

        const customerCart = await this.shopCartRepo.findCart(customerId) as ShopCart
        const cartId = customerCart.cart_id
        await this.shopCartRepo.deleteCartItem(cartId, itemId)
    }

    public editCartItem = async (userData : IjwtData, productId : number, qty : number) => {
        const customer = await this.customerRepo.findCustomer("user", {
            user_id : userData.id
        })
        if(!customer){
            throw new AuthenticationError("NPT_FOUND", "the customer was not found")
        }
        const customerId = customer.customer_id
        const shopCart = await this.shopCartRepo.findCart(customerId) as ShopCart
        const updatedCart = await this.shopCartRepo.updateItem(shopCart.cart_id, productId, qty)
        return updatedCart
    }
}