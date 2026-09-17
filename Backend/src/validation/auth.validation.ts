import Joi from "joi"
import { ROLES } from "../enum/enums"

export const loginScheam = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).max(18).required()
})

export const addressSchema = Joi.object({
    city : Joi.string().required(),
    state : Joi.string().required(),
    postal_code : Joi.string().optional(),
    longitude : Joi.number().required(),
    latitude : Joi.number().required(),
    address_line : Joi.string().optional()
})

export const signUpCustomerSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).max(18).required(),
    username : Joi.string().required(),
    phone_number: Joi.string().pattern(/^(97|98)\d{8}$/).required(),
    address : addressSchema.required(),
    role : Joi.string().valid(...Object.values(ROLES)).required(),
})

export const signUpAdminScehma = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).max(18).required(),
    username : Joi.string().required(),
    // store_name : Joi.string().required(),
    phone_number: Joi.string().pattern(/^(97|98)\d{8}$/).required(),
    // opening_time: Joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/).required(),
    // closing_time: Joi.string().pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/).required(),
    role : Joi.string().valid(...Object.values(ROLES)).required(),
    address : addressSchema.required()
})