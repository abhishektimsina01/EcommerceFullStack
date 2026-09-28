import crypto from "node:crypto"
import { Payment } from "../database/Entity/payment.entity"
import { appDataSource } from "../database/connect.db"
import { ORDER_STATUS } from "../enum/enums"
import { APIError } from "../exceptions/custom.exceptions"
import { OrderRepository } from "../repository/order.repository"
import { getEnvProperty } from "../utils/getEnvPropery.utils"

type EsewaPayload = Record<string, string>

export class PaymentService {
    private paymentRepo = appDataSource.getRepository(Payment)
    private orderRepo = new OrderRepository()

    private backendUrl = () => (process.env.BACKEND_URL || "http://localhost:8010").replace(/\/$/, "")

    private sign = (payload : EsewaPayload) => {
        const message = payload.signed_field_names
            .split(",")
            .map((field) => `${field.trim()}=${payload[field.trim()] ?? ""}`)
            .join(",")
        return crypto.createHmac("sha256", getEnvProperty("ESEWA_SECRET_KEY")).update(message).digest("base64")
    }

    private stringifyPayload = (raw : unknown) : EsewaPayload => {
        if(!raw || typeof raw !== "object") return {}
        const payload : EsewaPayload = {}
        for(const [key, value] of Object.entries(raw as Record<string, unknown>)){
            if(value == null) continue
            payload[key] = typeof value === "string" ? value : String(value)
        }
        return payload
    }

    private parseAmount = (value : string | number) => Number(String(value).replace(/,/g, ""))

    private orderIdFromUuid = (uuid : string) => {
        const match = String(uuid || "").match(/^ATO-(\d+)(?:-|$)/)
        return match ? Number(match[1]) : NaN
    }

    public createEsewaPayment = async (orderId : number, userId : number) => {
        const order = await this.orderRepo.orderRepo.findOne({
            where : {
                order_id : orderId,
                customer : {
                    user : {
                        user_id : userId
                    }
                }
            },
            relations : {
                payment : true,
                customer : {
                    user : true
                }
            }
        })
        if(!order) throw new APIError("order not found", 404)
        if(order.payment?.payment_id) throw new APIError("order is already paid", 400)
        if(order.status === ORDER_STATUS.CANCELED) throw new APIError("canceled orders cannot be paid", 400)

        const totalAmount = this.parseAmount(Number(order.price) * Number(order.quantity)).toFixed(2)
        const transactionUuid = `ATO-${orderId}-${Date.now()}`
        const origin = this.backendUrl()
        const payload : EsewaPayload = {
            amount : totalAmount,
            tax_amount : "0",
            total_amount : totalAmount,
            transaction_uuid : transactionUuid,
            product_code : getEnvProperty("ESEWA_PRODUCT_CODE"),
            product_service_charge : "0",
            product_delivery_charge : "0",
            success_url : `${origin}/api/payments/esewa/success`,
            failure_url : `${origin}/api/payments/esewa/failure?order_id=${orderId}`,
            signed_field_names : "total_amount,transaction_uuid,product_code"
        }
        return {
            action : getEnvProperty("ESEWA_PAYMENT_URL"),
            fields : { ...payload, signature : this.sign(payload) }
        }
    }

    public verifyEsewaPayment = async (queryOrderId : number, rawPayload : unknown) => {
        const payload = this.stringifyPayload(rawPayload)
        const orderId = (Number.isFinite(queryOrderId) && queryOrderId > 0)
            ? queryOrderId
            : this.orderIdFromUuid(payload.transaction_uuid)
        if(!Number.isFinite(orderId) || orderId <= 0) throw new APIError("order not found", 404)

        const order = await this.orderRepo.findOrder("order_id", orderId)
        if(!order) throw new APIError("order not found", 404)
        if(order.payment?.payment_id) return { orderId, paymentId : order.payment.payment_id }

        if(!payload.transaction_uuid) throw new APIError("invalid payment payload", 400)

        const expectedTotal = this.parseAmount(Number(order.price) * Number(order.quantity))
        const paidTotal = this.parseAmount(payload.total_amount)
        if(!Number.isFinite(paidTotal) || Math.abs(paidTotal - expectedTotal) > 0.05) {
            throw new APIError("payment amount mismatch", 400)
        }

        const existing = await this.paymentRepo.findOne({ where : { payment_idx : payload.transaction_uuid } })
        if(existing) {
            await this.orderRepo.markOrderPaid(orderId, existing)
            await this.clearOrderCache(orderId)
            return { orderId, paymentId : existing.payment_id }
        }

        const amountForStatus = String(payload.total_amount).replace(/,/g, "")
        const query = new URLSearchParams({
            product_code : getEnvProperty("ESEWA_PRODUCT_CODE"),
            total_amount : amountForStatus,
            transaction_uuid : payload.transaction_uuid
        })
        const response = await fetch(`${getEnvProperty("ESEWA_STATUS_URL")}?${query}`)
        let result : { status? : string } = {}
        try {
            result = await response.json() as { status? : string }
        } catch {
            throw new APIError("payment was not completed", 400)
        }
        if(!response.ok || result.status !== "COMPLETE") throw new APIError("payment was not completed", 400)

        const payment = await this.paymentRepo.save(
            this.paymentRepo.create({ payment_idx : payload.transaction_uuid })
        )
        await this.orderRepo.markOrderPaid(orderId, payment)
        await this.clearOrderCache(orderId)
        return { orderId, paymentId : payment.payment_id }
    }

    private clearOrderCache = async (orderId : number) => {
        const order = await this.orderRepo.orderRepo.findOne({
            where : { order_id : orderId },
            relations : { customer : { user : true } }
        })
        const userId = order?.customer?.user?.user_id
        if(!userId) return
        const { redisClient } = await import("../config/redis.config")
        await redisClient.del(`viewOrder:${userId}`)
        await redisClient.del(`viewOrders:${userId}`)
    }
}
