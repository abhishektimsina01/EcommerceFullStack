import { Repository } from "typeorm";
import { Order } from "../database/Entity/order.entity";
import { OrderItem } from "../database/Entity/order_item.entity";
import { appDataSource } from "../database/connect.db";


export class OrderRepository {

    private orderRepo : Repository<Order>
    private orderItemRepo : Repository<OrderItem>
    constructor(){
        this.orderItemRepo = appDataSource.getRepository(OrderItem)
        this.orderRepo = appDataSource.getRepository(Order)
    }

    public createOrder = async (customer_id : number, address_id : number) => {
        const order = this.orderRepo.create({
            customer : {
                customer_id : customer_id
            },
            address : {
                address_id : address_id
            }
        })
        return await this.orderRepo.save(order)
    }

    public addOrderItems = async (productData : {
        product_id : number
        quantity : number
        price : number
    }, orderId : number) => {
        const item = this.orderItemRepo.create({
            order : {
                order_id : orderId, 
            },
            price : productData.price,
            quantity : productData.quantity,
            product : {
                product_id : productData.product_id
            }
        })
        return this.orderItemRepo.save(item)
    }

    public getOrders = async () => {

    }

    public getOrder = async (customer_id : number) => {
        return await this.orderRepo.find({
            where : {
                customer : {
                    customer_id : customer_id
                }
            },
            select : {
                order_id : true,
                items : {
                    item_id : true,
                    price : true,
                    quantity : true,
                    product : {
                        product_id : true,
                        product_name : true,
                        product_image : true
                    }
                }
            },
            relations : {
                items : true
            }
        })
    }

    public deleteOrder = async () => {

    }

    public editOrder = async () => {

    }
}