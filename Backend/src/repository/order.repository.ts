import { In, Repository } from "typeorm";
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
                items : {
                    item_id : true,
                    price : true,
                    quantity : true,
                    product : {
                        product_id : true,
                        product_name : true,
                        product_image : true,
                        description : true,
                        provider : {
                            provider_id : true,
                            user : {
                                user_id : true,
                                username : true
                            }
                        }
                    }
                },
                payment : {
                    payment_id : true
                }
            },
            relations : {
                items : {
                    product : {
                        provider : {
                            user : true
                        }
                    }
                },
                payment : true
            }
        })
    }

    // for the producer
    public getOrderItem = async (product_ids : number[]) => {
        return await this.orderItemRepo.find({
            where : {
                product : {
                    product_id : In([...product_ids])
                }
            },
            select : {
                item_id : true,
                price : true,
                quantity : true,
                product : {
                    product_id : true, 
                    product_image : true,
                    description : true,
                    product_name : true,
                },
                order : {
                    order_id : true,
                    status : true,
                    customer : {
                        customer_id : true,
                        user : {
                            user_id : true,
                            username : true, 
                        }
                    },
                    payment : {
                        payment_id : true
                    }
                }
            },
            relations : {
                product : true,
                order : {
                    customer : {
                        user : true
                    },
                    payment : true
                }
            }
        })
    }

    public deleteOrder = async (orderId : number) => {
        return await this.orderRepo.delete({
            order_id : orderId
        })
    }

    public editOrder = async () => {

    }
}