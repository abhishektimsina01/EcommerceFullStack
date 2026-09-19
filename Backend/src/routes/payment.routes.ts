import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { ROLES } from "../enum/enums"
import { completeEsewaPayment, failEsewaPayment, initiateEsewaPayment } from "../controller/payment.controller"

export const paymentRouter = Router()

paymentRouter.post("/payments/esewa/initiate", authenticate, authorize(ROLES.CUSTOMER), initiateEsewaPayment)
paymentRouter.get("/payments/esewa/success", completeEsewaPayment)
paymentRouter.get("/payments/esewa/failure", failEsewaPayment)