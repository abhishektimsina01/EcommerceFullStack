"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopCartRepository = void 0;
const shop_cart_entity_1 = require("../database/Entity/shop_cart.entity");
const shop_cart_item_entity_1 = require("../database/Entity/shop_cart_item.entity");
const connect_db_1 = require("../database/connect.db");
class ShopCartRepository {
    shopCartRepo;
    shopCartItemRepo;
    constructor() {
        this.shopCartRepo = connect_db_1.appDataSource.getRepository(shop_cart_entity_1.ShopCart);
        this.shopCartItemRepo = connect_db_1.appDataSource.getRepository(shop_cart_item_entity_1.ShopCartItem);
    }
    findCart = async (customer_id) => {
        return await this.shopCartRepo.findOne({
            where: {
                customer: {
                    customer_id: customer_id
                }
            },
            select: {
                cart_id: true,
                items: {
                    cart_item_id: true
                }
            },
            relations: {
                items: true
            }
        });
    };
    findCartItems = async (cart_id) => {
        return await this.shopCartItemRepo.find({
            where: {
                cart: {
                    cart_id: cart_id
                }
            },
            select: {
                cart_item_id: true,
                product_item: {
                    product_id: true,
                    product_name: true,
                    product_image: true,
                    price: true,
                    product_type: true
                },
            },
            relations: {
                product_item: true
            }
        });
    };
    createCart = async (customer_id) => {
        const new_cart = this.shopCartRepo.create({
            customer: {
                customer_id: customer_id
            }
        });
        return await this.shopCartRepo.save(new_cart);
    };
    addItemInCart = async (cart_id, product_id) => {
        const new_item = this.shopCartItemRepo.create({
            cart: {
                cart_id: cart_id
            },
            product_item: {
                product_id: product_id
            },
            quantity: 1
        });
        return await this.shopCartItemRepo.save(new_item);
    };
    deleteCartItem = async (cart_id, product_id) => {
        const cartItem = await this.shopCartItemRepo.find({
            where: {
                cart: {
                    cart_id: cart_id
                },
                product_item: {
                    product_id: product_id
                }
            }
        });
        return await this.shopCartItemRepo.remove(cartItem);
    };
    updateItem = async (cart_id, product_id, qty) => {
        await this.shopCartItemRepo.update({
            cart: {
                cart_id: cart_id
            },
            product_item: {
                product_id: product_id
            }
        }, {
            quantity: qty
        });
        return await this.shopCartItemRepo.findOne({
            where: {
                cart: {
                    cart_id: cart_id
                },
                product_item: {
                    product_id: product_id
                }
            },
            select: {
                cart_item_id: true,
                product_item: {
                    product_id: true,
                    product_name: true,
                    product_image: true,
                    price: true,
                    product_type: true
                },
            }
        });
    };
}
exports.ShopCartRepository = ShopCartRepository;
