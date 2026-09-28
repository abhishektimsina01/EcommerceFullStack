import { NextFunction, Request, Response } from "express"
import { PaymentService } from "../service/payment.service"
import { sendAPIResponse } from "../utils/response.utils"

const paymentService = new PaymentService()

const frontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:5500").replace(/\/$/, "")

const parseEsewaPayload = (req : Request) => {
    const data = req.query.data
    if(typeof data === "string" && data.length > 0){
        const decoded = Buffer.from(data, "base64").toString("utf8")
        return JSON.parse(decoded)
    }
    return req.query
}

export const initiateEsewaPayment = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { order_id } = req.body
        const payment = await paymentService.createEsewaPayment(Number(order_id), req.user.id)
        return sendAPIResponse(res, "payment initialized", 200, payment)
    } catch(error) {
        next(error)
    }
}

export const completeEsewaPayment = async (req : Request, res : Response) => {
    const fallbackOrderId = Number(req.query.order_id)
    try {
        const payload = parseEsewaPayload(req)
        const result = await paymentService.verifyEsewaPayment(fallbackOrderId, payload)
        return res.redirect(`${frontendUrl()}/payment/success?order_id=${result.orderId}`)
    } catch(error) {
        console.log(error)
        const orderId = Number.isFinite(fallbackOrderId) ? fallbackOrderId : ""
        return res.redirect(`${frontendUrl()}/payment/failure?order_id=${orderId}`)
    }
}

export const failEsewaPayment = (req : Request, res : Response) => {
    return res.redirect(`${frontendUrl()}/payment/failure?order_id=${req.query.order_id || ""}`)
}
