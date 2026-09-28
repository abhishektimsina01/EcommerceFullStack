import { Repository } from "typeorm";
import { Order } from "../database/Entity/order.entity";
import { Payment } from "../database/Entity/payment.entity";
import { appDataSource } from "../database/connect.db";
import { ITEM_CATEGORY, ORDER_STATUS } from "../enum/enums";


export class OrderRepository {

    orderRepo : Repository<Order>

    constructor(){
        this.orderRepo = appDataSource.getRepository(Order)
    }

    public findAllOrder = async ()=> {
        return await this.orderRepo.find({
            where : {},
            select : {
                order_id : true,
                price : true,
                quantity : true,
                payment : {
                    payment_id : true,
                },
                product : {
                    product_id : true,
                    product_image : true,
                    product_name : true,
                    product_type : true
                },
                status : true
            },
            relations : {
                payment : true,
                product : true
            }
        },)
    }

    public findOrderAdmin = async <T>(key : string, value : T) => {
        return await this.orderRepo.findOne({
            where : {
                [`${key}`] : value
            },
            select : {
                order_id : true,
                product : {
                    product_id : true,
                    product_name : true,
                    product_image : true,
                },
                price : true,
                quantity : true,
                payment : {
                    payment_id : true,
                },
                status : true,
                address : {
                    address_id: true,
                    state : true,
                    city : true,
                    address_line : true,
                    postal_code : true,
                    created_at : true
                },
                customer : {
                    customer_id : true,
                    user : {
                        user_id : true,
                        username : true,
                        phone_number : true,
                        email : true,
                    }
                }
            },
            relations : {
                product : true,
                payment : true,
                address : true,
                customer : {
                    user : true
                }
            }
        })
    }

    public findOrder = async <T>(key : string, value : T) => {
        return await this.orderRepo.findOne({
            where : {
                [`${key}`] : value
            },
            select : {
                order_id : true,
                product : {
                    product_id : true,
                    product_name : true,
                    product_image : true,
                },
                price : true,
                quantity : true,
                payment : {
                    payment_id : true,
                },
                status : true,
                address : {
                    address_id: true,
                    state : true,
                    city : true,
                    address_line : true,
                    postal_code : true,
                    created_at : true
                }
            },
            relations : {
                product : true,
                payment : true,
                address : true
            }
        })
    }

    public createOrder = async (customer_id : number, address_id : number, product_id : number, price : number, quantity : number) => {
        const order = this.orderRepo.create({
            customer : {
                customer_id : customer_id
            },
            address : {
                address_id : address_id
            },
            product : {
                product_id : product_id
            },
            price,
            quantity
        })
        return await this.orderRepo.save(order)
    }

    // for the customer
    public getOrders = async (customer_id : number) => {
        return await this.orderRepo.find({
            where : {
                customer : {
                    customer_id : customer_id
                }
            },
            select : {
                order_id : true,
                status : true,
                quantity : true,
                price : true,
                product : {
                    product_id : true,
                    product_name : true,
                    product_image : true,
                    description : true,
                },
                payment : {
                    payment_id : true
                }
            },
            relations : {
                product : true,
                payment : true
            }
        })
    }

    // product categories this customer has ordered — feeds per-user recommendations
    public getOrderedCategories = async (customer_id : number) : Promise<ITEM_CATEGORY[]> => {
        const orders = await this.orderRepo.find({
            where : {
                customer : {
                    customer_id : customer_id
                }
            },
            select : {
                order_id : true,
                product : {
                    product_id : true,
                    product_type : true
                }
            },
            relations : {
                product : true
            }
        })
        return orders
            .map((order) => order.product?.product_type)
            .filter((category) : category is ITEM_CATEGORY => Boolean(category))
    }

    public markOrderPaid = async (orderId : number, payment : Payment) => {
        await this.orderRepo.update({ order_id : orderId }, { status : ORDER_STATUS.CONFIRMED })
        await this.orderRepo
            .createQueryBuilder()
            .relation(Order, "payment")
            .of(orderId)
            .set(payment)
    }

    public deleteOrder = async (orderId : number) => {
        return await this.orderRepo.delete({
            order_id : orderId
        })
    }
}
