import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../enum/enums";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controller/products.controller";

export const productRouter = Router()

productRouter.post("/products", authenticate, authorize(ROLES.PROVIDER), createProduct)
productRouter.get("/products", authenticate, authorize(...Object.values(ROLES)), getProducts)
productRouter.get("/product", authenticate as any, authorize(...Object.values(ROLES)) as any, getProduct)
productRouter.patch("/product", authenticate as any, authorize(ROLES.PROVIDER) as any, updateProduct)
productRouter.delete("/product", authenticate as any, authorize(ROLES.PROVIDER) as any, deleteProduct)