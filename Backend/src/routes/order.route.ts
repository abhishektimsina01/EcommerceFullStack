import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../enum/enums";
import { changeOrderState, deleteOrder, makeOrder, viewOrder, viewOrders } from "../controller/order.controller";

export const orderRouter = Router()

orderRouter.post("/orders", authenticate, authorize(ROLES.CUSTOMER), makeOrder)
orderRouter.get("/orders", authenticate, authorize(ROLES.CUSTOMER, ROLES.ADMIN), viewOrders)
orderRouter.get("/orders/:id", authenticate as any, authorize(ROLES.CUSTOMER, ROLES.ADMIN) as any, viewOrder)
orderRouter.delete("/orders/:id", authenticate as any, authorize(ROLES.CUSTOMER, ROLES.ADMIN) as any, deleteOrder)
orderRouter.patch("/orders/:id", authenticate as any, authorize(ROLES.ADMIN) as any, changeOrderState)