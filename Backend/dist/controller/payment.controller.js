"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failEsewaPayment = exports.completeEsewaPayment = exports.initiateEsewaPayment = void 0;
const payment_service_1 = require("../service/payment.service");
const response_utils_1 = require("../utils/response.utils");
const paymentService = new payment_service_1.PaymentService();
const initiateEsewaPayment = async (req, res, next) => {
    try {
        const { order_id, return_url } = req.body;
        const payment = await paymentService.createEsewaPayment(Number(order_id), String(return_url || "http://localhost:8010"));
        return (0, response_utils_1.sendAPIResponse)(res, "payment initialized", 200, payment);
    }
    catch (error) {
        next(error);
    }
};
exports.initiateEsewaPayment = initiateEsewaPayment;
const completeEsewaPayment = async (req, res, next) => {
    try {
        const orderId = Number(req.query.order_id);
        const responseData = typeof req.query.data === "string"
            ? JSON.parse(Buffer.from(req.query.data, "base64").toString("utf8"))
            : req.query;
        await paymentService.verifyEsewaPayment(orderId, responseData);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5500"}/?payment=success&order_id=${orderId}`);
    }
    catch (error) {
        next(error);
    }
};
exports.completeEsewaPayment = completeEsewaPayment;
const failEsewaPayment = (req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5500"}/?payment=failed&order_id=${req.query.order_id || ""}`);
};
exports.failEsewaPayment = failEsewaPayment;
