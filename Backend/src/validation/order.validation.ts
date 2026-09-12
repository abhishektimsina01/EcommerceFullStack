import Joi from "joi";
import { addressSchema } from "./auth.validation";

const productItem = Joi.object({
    product_id : Joi.number().positive().min(1).required(),
    quantity : Joi.number().positive().min(1).required()
})

export const orderSchema = Joi.object({
    product : Joi.array().items(productItem).unique().min(1).required(),
    current_address : Joi.object({
        address : addressSchema.optional(),
        default_address : Joi.bool().optional()
    }).min(1).max(1).required()
})