import { NextFunction, Request, Response } from "express";
import { ShopCartService } from "../service/cart.service";
import { Iparams } from "../interface/interfaces";
import { sendAPIResponse } from "../utils/response.utils";
import { APIError } from "../exceptions/custom.exceptions";

const shopCartservice = new ShopCartService()

export const addItemToCart = async (req : Request<Iparams>, res : Response, next : NextFunction) => {
    try{
        // add the item to the cart
        const response = await shopCartservice.addItemToCart(req.user, +req.params.id)
        return sendAPIResponse(res, "item added in your cart", 200)
    }
    catch(err){
        next(err)
    }
}

export const getCartItems = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const response = await shopCartservice.getAllShopCartItem(req.user)
        return sendAPIResponse(res, "items fetched from the cart", 200, response)
    }
    catch(err){
        next(err)
    }
}

export const deleteCartItem = async (req : Request, res : Response, next : NextFunction) => {
    try{
        // can be single or all
        const itemIds = req.body?.itemIds
        if(Array.isArray(itemIds) && itemIds.length != 0 ){
            await shopCartservice.deleteCartItem(req.user, Number(itemIds[0]))
        }
        else{
            const err = new APIError("send ids of the items to be removed", 200)
            err.name = "ValidationError"
            throw err
        }
        return sendAPIResponse(res, "deleted", 200)
    }
    catch(err){
        next(err)
    }
}

export const editItemInCart = async (req : Request<Iparams>, res : Response, next : NextFunction) => {
    try{
        const qty = req.body?.quantity ?? null
        if(qty == null){
            const err = new APIError("send qty of the items to be updated", 200)
            err.name = "ValidationError"
            throw err
        }
        const response = await shopCartservice.editCartItem(req.user, +req.params.id, qty)
        return sendAPIResponse(res, "updated", 200, response)
    }
    catch(err){
        next(err)
    }
}