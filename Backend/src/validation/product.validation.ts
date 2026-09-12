import Joi from "joi";
import { ITEM_CATEGORY } from "../enum/enums";

export const productItemSchema = Joi.object({
    product_name: Joi.string()
        .trim()
        .required(),

    product_type: Joi.string()
        .valid(...Object.values(ITEM_CATEGORY))
        .required(),

    description: Joi.string()
        .trim()
        .optional(),

    price: Joi.number()
        .positive()
        .required(),

    stock: Joi.number()
        .integer()
        .min(0)
        .required()
});

export const productItemSchemaUpdate = Joi.object({
    product_name: Joi.string()
        .trim()
        .optional(),

    product_type: Joi.string()
        .valid(...Object.values(ITEM_CATEGORY))
        .optional(),

    description: Joi.string()
        .trim()
        .optional(),

    price: Joi.number()
        .positive()
        .optional(),

    stock: Joi.number()
        .integer()
        .min(0)
        .optional()
}).min(1);