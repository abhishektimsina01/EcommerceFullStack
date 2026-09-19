import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../enum/enums";
import { addItemToCart, deleteCartItem, editItemInCart, getCartItems } from "../controller/cart.controller";

export const shopCartRouter = Router()

shopCartRouter.get("/cart", authenticate, authorize(ROLES.CUSTOMER), getCartItems)
shopCartRouter.get("/cart/:id", authenticate as any, authorize(ROLES.CUSTOMER) as any, addItemToCart)
shopCartRouter.delete("/cart", authenticate, authorize(ROLES.CUSTOMER), deleteCartItem)
shopCartRouter.patch("/cart/:id", authenticate as any, authorize(ROLES.CUSTOMER) as any, editItemInCart)