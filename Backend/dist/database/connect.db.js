"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = exports.appDataSource = void 0;
const typeorm_1 = require("typeorm");
const getEnvPropery_utils_1 = require("../utils/getEnvPropery.utils");
const user_entity_1 = require("./Entity/user.entity");
const customer_entity_1 = require("./Entity/customer.entity");
const admin_entity_1 = require("./Entity/admin.entity");
const address_entity_1 = require("./Entity/address.entity");
const product_entity_1 = require("./Entity/product.entity");
const shop_cart_entity_1 = require("./Entity/shop_cart.entity");
const shop_cart_item_entity_1 = require("./Entity/shop_cart_item.entity");
const order_entity_1 = require("./Entity/order.entity");
const payment_entity_1 = require("./Entity/payment.entity");
exports.appDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    database: "ecommerceDb",
    username: (0, getEnvPropery_utils_1.getEnvProperty)("db_username"),
    password: (0, getEnvPropery_utils_1.getEnvProperty)("db_password"),
    entities: [user_entity_1.User, customer_entity_1.Customer, admin_entity_1.Admin, address_entity_1.Address, product_entity_1.Product, shop_cart_entity_1.ShopCart, shop_cart_item_entity_1.ShopCartItem, order_entity_1.Order, payment_entity_1.Payment],
    synchronize: false
});
const connectDb = async () => {
    let tries = 1;
    let status = false;
    while (tries <= 5) {
        try {
            await exports.appDataSource.initialize();
            status = true;
            break;
        }
        catch (err) {
            console.log(`${tries} try failed to connect db`);
            tries++;
            if (tries == 6) {
                console.log(err);
            }
        }
    }
    if (status) {
        console.log("Database connected successfully✅");
    }
    else {
        throw new Error("Database failed to connect❌");
    }
};
exports.connectDb = connectDb;
