"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.changeOrderState = exports.viewOrder = exports.viewOrders = exports.makeOrder = void 0;
const order_validation_1 = require("../validation/order.validation");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const order_service_1 = require("../service/order.service");
const response_utils_1 = require("../utils/response.utils");
const orderService = new order_service_1.OrderService();
const makeOrder = async (req, res, next) => {
    try {
        const { error } = order_validation_1.orderSchema.validate(req.body);
        if (error) {
            throw new custom_exceptions_1.ValidationError(error);
        }
        const orderData = req.body;
        const response = await orderService.makeOrder(req.user, orderData);
        return (0, response_utils_1.sendAPIResponse)(res, "order made", 200, response);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
exports.makeOrder = makeOrder;
const viewOrders = async (req, res, next) => {
    try {
        const response = await orderService.viewOrders(req.user);
        return (0, response_utils_1.sendAPIResponse)(res, "orders", 200, response);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
exports.viewOrders = viewOrders;
const viewOrder = async (req, res, next) => {
    try {
        const response = await orderService.viewOrder(req.user, +req.params.id);
        return (0, response_utils_1.sendAPIResponse)(res, "order", 200, response);
    }
    catch (err) {
        next(err);
    }
};
exports.viewOrder = viewOrder;
const changeOrderState = async (req, res, next) => {
    try {
        const response = await orderService.changeOrderState(req.user, +req.params.id, req.body?.status ?? req.body);
        return (0, response_utils_1.sendAPIResponse)(res, "order", 200, response);
    }
    catch (err) {
        next(err);
    }
};
exports.changeOrderState = changeOrderState;
const deleteOrder = async (req, res, next) => {
    try {
        await orderService.deleteOrder(req.user, +req.params.id);
        return (0, response_utils_1.sendAPIResponse)(res, "prder deleted", 200);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteOrder = deleteOrder;
