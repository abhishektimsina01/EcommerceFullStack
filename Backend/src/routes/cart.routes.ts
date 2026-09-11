import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../enum/enums";
import { addItemToCart, deleteCartItem, editItemInCart, getCartItems } from "../controller/cart.controller";

const shopCartRouter = Router()

shopCartRouter.get("/cart", authenticate, authorize(ROLES.CUSTOMER), getCartItems)
shopCartRouter.get("/cart", authenticate as any, authorize(ROLES.CUSTOMER) as any, addItemToCart)
shopCartRouter.delete("/cart", authenticate, authorize(ROLES.CUSTOMER), deleteCartItem)
shopCartRouter.patch("/cart", authenticate as any, authorize(ROLES.CUSTOMER) as any, editItemInCart)