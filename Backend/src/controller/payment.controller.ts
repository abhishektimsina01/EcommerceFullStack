import { NextFunction, Request, Response } from "express"
import { PaymentService } from "../service/payment.service"
import { sendAPIResponse } from "../utils/response.utils"

const paymentService = new PaymentService()

export const initiateEsewaPayment = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { order_id, return_url } = req.body
        const payment = await paymentService.createEsewaPayment(Number(order_id), String(return_url || "http://localhost:8010"))
        return sendAPIResponse(res, "payment initialized", 200, payment)
    } catch(error) {
        next(error)
    }
}

export const completeEsewaPayment = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const orderId = Number(req.query.order_id)
        const responseData = typeof req.query.data === "string"
            ? JSON.parse(Buffer.from(req.query.data, "base64").toString("utf8"))
            : req.query
        await paymentService.verifyEsewaPayment(orderId, responseData as Record<string, string>)
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5500"}/?payment=success&order_id=${orderId}`)
    } catch(error) {
        next(error)
    }
}

export const failEsewaPayment = (req : Request, res : Response) => {
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5500"}/?payment=failed&order_id=${req.query.order_id || ""}`)
}