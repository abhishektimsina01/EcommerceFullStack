"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const order_entity_1 = require("../database/Entity/order.entity");
const connect_db_1 = require("../database/connect.db");
class OrderRepository {
    orderRepo;
    constructor() {
        this.orderRepo = connect_db_1.appDataSource.getRepository(order_entity_1.Order);
    }
    findAllOrder = async () => {
        return await this.orderRepo.find({
            where: {},
            select: {
                order_id: true,
                price: true,
                quantity: true,
                payment: {
                    payment_id: true,
                },
                product: {
                    product_id: true,
                    product_image: true,
                    product_name: true,
                    product_type: true
                },
                status: true
            },
            relations: {
                payment: true,
                product: true
            }
        });
    };
    findOrderAdmin = async (key, value) => {
        return await this.orderRepo.findOne({
            where: {
                [`${key}`]: value
            },
            select: {
                order_id: true,
                product: {
                    product_id: true,
                    product_name: true,
                    product_image: true,
                },
                price: true,
                quantity: true,
                payment: {
                    payment_id: true,
                },
                status: true,
                address: {
                    address_id: true,
                    state: true,
                    city: true
                },
                customer: {
                    customer_id: true,
                    user: {
                        user_id: true,
                        username: true,
                        phone_number: true,
                        email: true,
                    }
                }
            },
            relations: {
                product: true,
                payment: true,
                address: true,
                customer: {
                    user: true
                }
            }
        });
    };
    findOrder = async (key, value) => {
        return await this.orderRepo.findOne({
            where: {
                [`${key}`]: value
            },
            select: {
                order_id: true,
                product: {
                    product_id: true,
                    product_name: true,
                    product_image: true,
                },
                price: true,
                quantity: true,
                payment: {
                    payment_id: true,
                },
                status: true,
                address: {
                    address_id: true,
                    state: true,
                    city: true
                }
            },
            relations: {
                product: true,
                payment: true,
                address: true
            }
        });
    };
    createOrder = async (customer_id, address_id, product_id, price, quantity) => {
        const order = this.orderRepo.create({
            customer: {
                customer_id: customer_id
            },
            address: {
                address_id: address_id
            },
            product: {
                product_id: product_id
            },
            price,
            quantity
        });
        return await this.orderRepo.save(order);
    };
    // for the customer
    getOrders = async (customer_id) => {
        return await this.orderRepo.find({
            where: {
                customer: {
                    customer_id: customer_id
                }
            },
            select: {
                order_id: true,
                status: true,
                quantity: true,
                price: true,
                product: {
                    product_id: true,
                    product_name: true,
                    product_image: true,
                    description: true,
                },
                payment: {
                    payment_id: true
                }
            },
            relations: {
                product: true,
                payment: true
            }
        });
    };
    deleteOrder = async (orderId) => {
        return await this.orderRepo.delete({
            order_id: orderId
        });
    };
}
exports.OrderRepository = OrderRepository;
