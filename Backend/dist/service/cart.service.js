"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopCartService = void 0;
const cart_repository_1 = require("../repository/cart.repository");
const product_repository_1 = require("../repository/product.repository");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const customer_repository_1 = require("../repository/customer.repository");
class ShopCartService {
    shopCartRepo;
    productRepo;
    customerRepo;
    constructor() {
        this.shopCartRepo = new cart_repository_1.ShopCartRepository();
        this.productRepo = new product_repository_1.ProductRepository();
        this.customerRepo = new customer_repository_1.CustomerRepository();
    }
    addItemToCart = async (userData, productId) => {
        const product = await this.productRepo.checkProductItem(productId);
        if (!product) {
            throw new custom_exceptions_1.AuthenticationError("PRODUCT_NOT_FOUND", "there is no product");
        }
        const customer = await this.customerRepo.findCustomer("user", {
            user_id: userData.id
        });
        if (!customer) {
            throw new custom_exceptions_1.AuthenticationError("CUSTOMER_NOT_FOUND", "there is no customer");
        }
        const customerId = customer.customer_id;
        const cart = await this.shopCartRepo.findCart(customerId);
        let cartId = cart?.cart_id;
        if (!cart) {
            const new_cart = await this.shopCartRepo.createCart(customerId);
            cartId = new_cart.cart_id;
        }
        else {
            const itemsInCart = await this.shopCartRepo.findCartItems(cartId);
            const containsProduct = itemsInCart.some((item) => {
                if (item.product_item.product_id === productId) {
                    return true;
                }
            });
            if (containsProduct) {
                return {};
            }
        }
        const cartItem = await this.shopCartRepo.addItemInCart(cartId, productId);
        return cartItem;
    };
    getAllShopCartItem = async (userData) => {
        const customer = await this.customerRepo.findCustomer('user', {
            user_id: userData.id
        });
        if (!customer) {
            throw new custom_exceptions_1.AuthenticationError("NPT_FOUND", "the customer was not found");
        }
        const customerId = customer.customer_id;
        const customerCart = await this.shopCartRepo.findCart(customerId);
        let cartId = customerCart?.cart_id;
        if (!customerCart) {
            const newCart = await this.shopCartRepo.createCart(customerId);
            cartId = newCart.cart_id;
        }
        const addedItem = await this.shopCartRepo.findCartItems(cartId);
        return addedItem;
    };
    deleteCartItem = async (userData, itemId) => {
        const customer = await this.customerRepo.findCustomer("user", {
            user_id: userData.id
        });
        if (!customer) {
            throw new custom_exceptions_1.AuthenticationError("NPT_FOUND", "the customer was not found");
        }
        const customerId = customer.customer_id;
        const customerCart = await this.shopCartRepo.findCart(customerId);
        const cartId = customerCart.cart_id;
        await this.shopCartRepo.deleteCartItem(cartId, itemId);
    };
    editCartItem = async (userData, productId, qty) => {
        const customer = await this.customerRepo.findCustomer("user", {
            user_id: userData.id
        });
        if (!customer) {
            throw new custom_exceptions_1.AuthenticationError("NPT_FOUND", "the customer was not found");
        }
        const customerId = customer.customer_id;
        const shopCart = await this.shopCartRepo.findCart(customerId);
        const updatedCart = await this.shopCartRepo.updateItem(shopCart.cart_id, productId, qty);
        return updatedCart;
    };
}
exports.ShopCartService = ShopCartService;
