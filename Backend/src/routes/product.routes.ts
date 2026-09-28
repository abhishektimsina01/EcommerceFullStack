import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../enum/enums";
import { createProduct, deleteProduct, getProduct, getProducts, getRecommendedProducts, updateProduct } from "../controller/products.controller";
import { upload } from "../config/multer.config";

export const productRouter = Router()

productRouter.post("/products", authenticate, authorize(ROLES.ADMIN), upload.single("image"), createProduct)
productRouter.get("/products/recommended", authenticate, authorize(ROLES.CUSTOMER), getRecommendedProducts)
productRouter.get("/products", getProducts)
productRouter.get("/product/:id", getProduct)
productRouter.patch("/product/:id", authenticate as any, authorize(ROLES.ADMIN) as any, updateProduct)
productRouter.delete("/product/:id", authenticate as any, authorize(ROLES.ADMIN) as any, deleteProduct)
