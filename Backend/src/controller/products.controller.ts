import { NextFunction, Request, response, Response } from "express";
import { Ifilters, Iparams } from "../interface/interfaces";
import { ProductService } from "../service/products.service";
import { sendAPIResponse } from "../utils/response.utils";
import { productItemSchema, productItemSchemaUpdate } from "../validation/product.validation";
import { QueryError, ValidationError } from "../exceptions/custom.exceptions";
import { extractKeysFromObj } from "../utils/checkKeyAndRetrieveValue";
import { ProductFilterConstant } from "../constant/filters.constant";
import { ROLES } from "../enum/enums";
import { QueryFailedError } from "typeorm";

const productService = new ProductService()

export const createProduct = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {error} = productItemSchema.validate(req.body)
        if(error){
            throw new ValidationError(error)
        }
        const path = req.file?.path ?? null
        const response = await productService.createProduct(req.user, req.body, path)
        return sendAPIResponse(res, "product added", 200, response)
    }
    catch(err){
        if(err instanceof QueryFailedError){
            throw new QueryError(err)
        }
        next(err)
    }
}

export const getProducts = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const filters : Ifilters = req.query
        const purifiedFilter = extractKeysFromObj(filters as Record<string, unknown>, ProductFilterConstant[ROLES.CUSTOMER])
        const response = await productService.getAllProducts(req.user, purifiedFilter as Ifilters)
        return sendAPIResponse(res, "products fetched", 200, response)
    }
    catch(err){
        next(err)
    }
}

export const getRecommendedProducts = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const filters : Ifilters = req.query
        const purifiedFilter = extractKeysFromObj(filters as Record<string, unknown>, ProductFilterConstant[ROLES.CUSTOMER])
        const response = await productService.getRecommendedProducts(req.user, purifiedFilter as Ifilters)
        return sendAPIResponse(res, "recommended products fetched", 200, response)
    }
    catch(err){
        next(err)
    }
}

export const getProduct = async (req : Request<Iparams>, res : Response, next : NextFunction) => {
    try{
        const user = req.user ?? { id: 0, username: "guest", role: ROLES.CUSTOMER }
        const response = await productService.getProductService(user, +req.params.id)
        return sendAPIResponse(res, "product fetched", 200, {
            ...response
        })
    }
    catch(err){
        next(err)
    }
}

export const deleteProduct = async (req : Request<Iparams>, res : Response, next : NextFunction) => {
    try{
        await productService.deleteProduct(req.user, +req.params.id)
        return sendAPIResponse(res, "removed the product", 200)
    }
    catch(err){
        next(err)
    }
}

export const updateProduct = async (req : Request<Iparams>, res : Response, next : NextFunction) => {
    try{
        const {error} = productItemSchemaUpdate.validate(req.body)
        if(error){
            throw new ValidationError(error)
        }
        const response = await productService.updateProduct(req.user, +req.params.id, req.body)
        return sendAPIResponse(res, "product changed", 200, response)
    }
    catch(err){
        next(err)
    }
}