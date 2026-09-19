import crypto from "node:crypto"
import { Payment } from "../database/Entity/payment.entity"
import { appDataSource } from "../database/connect.db"
import { APIError } from "../exceptions/custom.exceptions"
import { getEnvProperty } from "../utils/getEnvPropery.utils"
import { OrderRepository } from "../repository/order.repository"

type EsewaPayload = Record<string, string>

export class PaymentService {
    private paymentRepo = appDataSource.getRepository(Payment)
    private orderRepo = new OrderRepository()

    private sign = (payload : EsewaPayload) => {
        const message = payload.signed_field_names.split(",").map((field) => `${field}=${payload[field]}`).join(",")
        return crypto.createHmac("sha256", getEnvProperty("ESEWA_SECRET_KEY")).update(message).digest("base64")
    }

    public createEsewaPayment = async (orderId : number, returnUrl : string) => {
        const order = await this.orderRepo.findOrder("order_id", orderId)
        if(!order) throw new APIError("order not found", 404)
        const totalAmount = (Number(order.price) * Number(order.quantity)).toFixed(2)
        const transactionUuid = `ATO-${orderId}-${Date.now()}`
        const payload : EsewaPayload = {
            amount : totalAmount,
            tax_amount : "0",
            total_amount : totalAmount,
            transaction_uuid : transactionUuid,
            product_code : getEnvProperty("ESEWA_PRODUCT_CODE"),
            product_service_charge : "0",
            product_delivery_charge : "0",
            success_url : `${returnUrl}/api/payments/esewa/success?order_id=${orderId}`,
            failure_url : `${returnUrl}/api/payments/esewa/failure?order_id=${orderId}`,
            signed_field_names : "total_amount,transaction_uuid,product_code"
        }
        return {
            action : getEnvProperty("ESEWA_PAYMENT_URL"),
            fields : { ...payload, signature : this.sign(payload) }
        }
    }

    public verifyEsewaPayment = async (orderId : number, payload : EsewaPayload) => {
        const order = await this.orderRepo.findOrder("order_id", orderId)
        if(!order) throw new APIError("order not found", 404)
        if(payload.signature !== this.sign(payload)) throw new APIError("invalid payment signature", 400)
        const expectedTotal = (Number(order.price) * Number(order.quantity)).toFixed(2)
        if(payload.total_amount !== expectedTotal) throw new APIError("payment amount mismatch", 400)
        const query = new URLSearchParams({ product_code : getEnvProperty("ESEWA_PRODUCT_CODE"), total_amount : payload.total_amount, transaction_uuid : payload.transaction_uuid })
        const response = await fetch(`${getEnvProperty("ESEWA_STATUS_URL")}?${query}`)
        const result = await response.json() as { status? : string }
        if(!response.ok || result.status !== "COMPLETE") throw new APIError("payment was not completed", 400)
        const payment = this.paymentRepo.create({ payment_idx : payload.transaction_uuid, order : { order_id : orderId } })
        return await this.paymentRepo.save(payment)
    }
}