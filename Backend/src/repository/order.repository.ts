import { In, Repository } from "typeorm";
import { Order } from "../database/Entity/order.entity";
import { appDataSource } from "../database/connect.db";


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
                    city : true
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
                    city : true
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

    public deleteOrder = async (orderId : number) => {
        return await this.orderRepo.delete({
            order_id : orderId
        })
    }
}