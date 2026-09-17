import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../enum/enums";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controller/products.controller";
import { upload } from "../config/multer.config";

export const productRouter = Router()

productRouter.post("/products", authenticate, authorize(ROLES.ADMIN), upload.single("image"), createProduct)
productRouter.get("/products", authenticate, authorize(...Object.values(ROLES)), getProducts)
productRouter.get("/product", authenticate as any, authorize(...Object.values(ROLES)) as any, getProduct)
productRouter.patch("/product", authenticate as any, authorize(ROLES.ADMIN) as any, updateProduct)
productRouter.delete("/product", authenticate as any, authorize(ROLES.ADMIN) as any, deleteProduct)