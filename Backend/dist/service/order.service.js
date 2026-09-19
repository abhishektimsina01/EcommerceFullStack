"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const enums_1 = require("../enum/enums");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const address_repository_1 = require("../repository/address.repository");
const cart_repository_1 = require("../repository/cart.repository");
const customer_repository_1 = require("../repository/customer.repository");
const order_repository_1 = require("../repository/order.repository");
const product_repository_1 = require("../repository/product.repository");
const user_repository_1 = require("../repository/user.repository");
const role_helper_1 = require("../helper/role.helper");
const redis_config_1 = require("../config/redis.config");
class OrderService {
    userRepo;
    orderRepo;
    customerRepo;
    shopCartRepo;
    productRepo;
    addressRepo;
    roleHelper;
    constructor() {
        this.orderRepo = new order_repository_1.OrderRepository();
        this.customerRepo = new customer_repository_1.CustomerRepository();
        this.shopCartRepo = new cart_repository_1.ShopCartRepository();
        this.productRepo = new product_repository_1.ProductRepository();
        this.addressRepo = new address_repository_1.AddressRepository();
        this.userRepo = new user_repository_1.UserRepository();
        this.roleHelper = new role_helper_1.RoleHelper();
    }
    makeOrder = async (userData, orderData) => {
        const products = orderData.product;
        const customer = await this.customerRepo.findCustomer("user", {
            user_id: userData.id
        });
        if (!customer) {
            throw new custom_exceptions_1.AuthenticationError("CUSTOMER_NOT_FOUND", "no customer was found");
        }
        const isCart = await this.shopCartRepo.findCart(customer.customer_id);
        // for address
        let address_id;
        if (orderData.current_address.address) {
            const address = await this.addressRepo.addAddress(orderData.current_address.address);
            address_id = address.address_id;
        }
        else {
            const user = await this.userRepo.findUser("user_id", userData.id);
            address_id = user.address.address_id;
        }
        // find the product
        const fetched_product = await this.productRepo.findProductItem("product_id", products.product_id, enums_1.ROLES.ADMIN);
        if (!fetched_product) {
            throw new custom_exceptions_1.AuthenticationError("NOT_FOUND", "product not found");
        }
        // check for the product
        if (products.quantity > fetched_product.stock) {
            // item out of the stock oh no!!
            throw new custom_exceptions_1.APIError("order failed", 404, {
                content: "quantity more than the stock"
            });
        }
        // create order
        const order = await this.orderRepo.createOrder(customer.customer_id, address_id, products.product_id, fetched_product.price, products.quantity);
        await this.productRepo.updateProduct(products.product_id, {
            stock: fetched_product.stock - products.quantity
        });
        if (isCart) {
            await this.shopCartRepo.deleteCartItem(isCart.cart_id, products.product_id);
        }
        await redis_config_1.redisClient.del(`viewOrder:${userData.id}`);
        return order;
    };
    viewOrders = async (userData) => {
        if (this.roleHelper.isCustomer(userData.role)) {
            if (await redis_config_1.redisClient.exists(`viewOrder:${userData.id}`) != 0) {
                return await redis_config_1.redisClient.get(`viewOrder:${userData.id}`);
            }
            const customer = await this.customerRepo.findCustomer("user", {
                user_id: userData.id
            });
            // find the orders made by the customer
            const orders = await this.orderRepo.getOrders(customer.customer_id);
            let response = [];
            for (let order of orders) {
                const orderFormt = {
                    order_id: order.order_id,
                    price: order.price,
                    quantity: order.quantity,
                    status: order.status,
                    payment_id: order?.payment?.payment_id ?? null,
                    product: order.product
                };
                response.push(orderFormt);
            }
            await redis_config_1.redisClient.set(`viewOrders:${userData.id}`, JSON.stringify(response));
            return response;
        }
        // admin
        else if (this.roleHelper.isAdmin(userData.role)) {
            const orders = await this.orderRepo.findAllOrder();
            return orders;
        }
    };
    viewOrder = async (userData, order_id) => {
        let order;
        if (this.roleHelper.isCustomer(userData.role)) {
            order = await this.orderRepo.findOrder("order_id", order_id);
        }
        else {
            order = await this.orderRepo.findOrderAdmin("order_id", order_id);
        }
        if (!order) {
            const err = new custom_exceptions_1.APIError("error", 404);
            throw err;
        }
        return {
            ...order,
            total: order.price * order.quantity
        };
    };
    changeOrderState = async (userData, order_id, state) => {
        const order = await this.orderRepo.findOrder("order_id", order_id);
        if (!order) {
            const err = new custom_exceptions_1.APIError("error", 404);
            throw err;
        }
        if (this.roleHelper.isCustomer(userData.role)) {
            if (order.status === enums_1.ORDER_STATUS.PENDING && state === enums_1.ORDER_STATUS.CANCELED) {
                order.status = enums_1.ORDER_STATUS.CANCELED;
                return await this.orderRepo.orderRepo.save(order);
            }
            else {
                throw new custom_exceptions_1.AuthotizationError("NOT ALLOWED");
            }
        }
        else {
            if (state === enums_1.ORDER_STATUS.CANCELED) {
                if (order.status === enums_1.ORDER_STATUS.PENDING || order.status === enums_1.ORDER_STATUS.PROCESSING) {
                    order.status = enums_1.ORDER_STATUS.CANCELED;
                    return await this.orderRepo.orderRepo.save(order);
                }
                else {
                    throw new custom_exceptions_1.AuthotizationError("NOT ALLOWED");
                }
            }
            else if (state === enums_1.ORDER_STATUS.PROCESSING) {
                if (order.status === enums_1.ORDER_STATUS.PENDING) {
                    order.status = enums_1.ORDER_STATUS.PROCESSING;
                    return await this.orderRepo.orderRepo.save(order);
                }
            }
            else if (state === enums_1.ORDER_STATUS.DELIVERED) {
                if (order.status === enums_1.ORDER_STATUS.PROCESSING) {
                    order.status === enums_1.ORDER_STATUS.PROCESSING;
                    return await this.orderRepo.orderRepo.save(order);
                }
            }
            else {
                throw new custom_exceptions_1.AuthotizationError("NOT ALLOWED");
            }
        }
    };
    deleteOrder = async (userData, order_id) => {
        const order = await this.orderRepo.findOrder("order_id", order_id);
        if (!order) {
            const err = new custom_exceptions_1.APIError("order was not found", 404);
            err.name = "ORDER_NOT_FOUND";
        }
        await this.orderRepo.deleteOrder(order_id);
    };
}
exports.OrderService = OrderService;
