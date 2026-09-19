"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const payment_entity_1 = require("../database/Entity/payment.entity");
const connect_db_1 = require("../database/connect.db");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const getEnvPropery_utils_1 = require("../utils/getEnvPropery.utils");
const order_repository_1 = require("../repository/order.repository");
class PaymentService {
    paymentRepo = connect_db_1.appDataSource.getRepository(payment_entity_1.Payment);
    orderRepo = new order_repository_1.OrderRepository();
    sign = (payload) => {
        const message = payload.signed_field_names.split(",").map((field) => `${field}=${payload[field]}`).join(",");
        return node_crypto_1.default.createHmac("sha256", (0, getEnvPropery_utils_1.getEnvProperty)("ESEWA_SECRET_KEY")).update(message).digest("base64");
    };
    createEsewaPayment = async (orderId, returnUrl) => {
        const order = await this.orderRepo.findOrder("order_id", orderId);
        if (!order)
            throw new custom_exceptions_1.APIError("order not found", 404);
        const totalAmount = (Number(order.price) * Number(order.quantity)).toFixed(2);
        const transactionUuid = `ATO-${orderId}-${Date.now()}`;
        const payload = {
            amount: totalAmount,
            tax_amount: "0",
            total_amount: totalAmount,
            transaction_uuid: transactionUuid,
            product_code: (0, getEnvPropery_utils_1.getEnvProperty)("ESEWA_PRODUCT_CODE"),
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${returnUrl}/api/payments/esewa/success?order_id=${orderId}`,
            failure_url: `${returnUrl}/api/payments/esewa/failure?order_id=${orderId}`,
            signed_field_names: "total_amount,transaction_uuid,product_code"
        };
        return {
            action: (0, getEnvPropery_utils_1.getEnvProperty)("ESEWA_PAYMENT_URL"),
            fields: { ...payload, signature: this.sign(payload) }
        };
    };
    verifyEsewaPayment = async (orderId, payload) => {
        const order = await this.orderRepo.findOrder("order_id", orderId);
        if (!order)
            throw new custom_exceptions_1.APIError("order not found", 404);
        if (payload.signature !== this.sign(payload))
            throw new custom_exceptions_1.APIError("invalid payment signature", 400);
        const expectedTotal = (Number(order.price) * Number(order.quantity)).toFixed(2);
        if (payload.total_amount !== expectedTotal)
            throw new custom_exceptions_1.APIError("payment amount mismatch", 400);
        const query = new URLSearchParams({ product_code: (0, getEnvPropery_utils_1.getEnvProperty)("ESEWA_PRODUCT_CODE"), total_amount: payload.total_amount, transaction_uuid: payload.transaction_uuid });
        const response = await fetch(`${(0, getEnvPropery_utils_1.getEnvProperty)("ESEWA_STATUS_URL")}?${query}`);
        const result = await response.json();
        if (!response.ok || result.status !== "COMPLETE")
            throw new custom_exceptions_1.APIError("payment was not completed", 400);
        const payment = this.paymentRepo.create({ payment_idx: payload.transaction_uuid, order: { order_id: orderId } });
        return await this.paymentRepo.save(payment);
    };
}
exports.PaymentService = PaymentService;
