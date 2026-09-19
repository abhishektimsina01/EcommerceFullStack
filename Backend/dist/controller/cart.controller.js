"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editItemInCart = exports.deleteCartItem = exports.getCartItems = exports.addItemToCart = void 0;
const cart_service_1 = require("../service/cart.service");
const response_utils_1 = require("../utils/response.utils");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const shopCartservice = new cart_service_1.ShopCartService();
const addItemToCart = async (req, res, next) => {
    try {
        // add the item to the cart
        const response = await shopCartservice.addItemToCart(req.user, +req.params.id);
        return (0, response_utils_1.sendAPIResponse)(res, "item added in your cart", 200);
    }
    catch (err) {
        next(err);
    }
};
exports.addItemToCart = addItemToCart;
const getCartItems = async (req, res, next) => {
    try {
        const response = await shopCartservice.getAllShopCartItem(req.user);
        return (0, response_utils_1.sendAPIResponse)(res, "items fetched from the cart", 200, response);
    }
    catch (err) {
        next(err);
    }
};
exports.getCartItems = getCartItems;
const deleteCartItem = async (req, res, next) => {
    try {
        // can be single or all
        const itemIds = req.body?.itemIds;
        if (Array.isArray(itemIds) && itemIds.length != 0) {
            await shopCartservice.deleteCartItem(req.user, Number(itemIds[0]));
        }
        else {
            const err = new custom_exceptions_1.APIError("send ids of the items to be removed", 200);
            err.name = "ValidationError";
            throw err;
        }
        return (0, response_utils_1.sendAPIResponse)(res, "deleted", 200);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteCartItem = deleteCartItem;
const editItemInCart = async (req, res, next) => {
    try {
        const qty = req.body?.quantity ?? null;
        if (qty == null) {
            const err = new custom_exceptions_1.APIError("send qty of the items to be updated", 200);
            err.name = "ValidationError";
            throw err;
        }
        const response = await shopCartservice.editCartItem(req.user, +req.params.id, qty);
        return (0, response_utils_1.sendAPIResponse)(res, "updated", 200, response);
    }
    catch (err) {
        next(err);
    }
};
exports.editItemInCart = editItemInCart;
