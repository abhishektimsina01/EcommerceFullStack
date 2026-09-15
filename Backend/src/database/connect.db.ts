import {DataSource} from "typeorm"
import { getEnvProperty } from "../utils/getEnvPropery.utils"
import { User } from "./Entity/user.entity"
import { Customer } from "./Entity/customer.entity"
import { Admin } from "./Entity/admin.entity"
import { Provider } from "./Entity/provider.entity"
import { Address } from "./Entity/address.entity"
import { Product } from "./Entity/product.entity"
import { ShopCart } from "./Entity/shop_cart.entity"
import { ShopCartItem } from "./Entity/shop_cart_item.entity"
import { Order } from "./Entity/order.entity"
import { OrderItem } from "./Entity/order_item.entity"
import { Payment } from "./Entity/payment.entity"

export const appDataSource : DataSource = new DataSource({
    type : "mysql",
    host : "localhost",
    port : 3306,
    database:"ecommerceDb",
    username : getEnvProperty("db_username"),
    password : getEnvProperty("db_password"),
    entities : [User, Customer, Admin, Provider, Address, Product, ShopCart, ShopCartItem, Order, OrderItem, Payment],
    synchronize : false
})

export const connectDb = async () => {
    let tries : number = 1
    let status : boolean = false
    while(tries <= 5){
        try{
            await appDataSource.initialize()
            status = true
            break
        }
        catch(err){
            console.log(`${tries} try failed to connect db`)
            tries++
            if(tries == 6){
                console.log(err)
            }
        }
    }
    if(status){
        console.log("Database connected successfully✅")
    }
    else{
        throw new Error("Database failed to connect❌")
    }
}