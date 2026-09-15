import { NextFunction, Request, Response } from "express";
import { Iorder, Iparams } from "../interface/interfaces";
import { orderSchema } from "../validation/order.validation";
import { ValidationError } from "../exceptions/custom.exceptions";
import { OrderService } from "../service/order.service";
import { sendAPIResponse } from "../utils/response.utils";

const orderService = new OrderService()

export const makeOrder = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {error} = orderSchema.validate(req.body)
        if(error){
            throw new ValidationError(error)
        }
        const orderData : Iorder = req.body
        const response = await orderService.makeOrder(req.user, orderData)
        return sendAPIResponse(res, "order made", 200, response)
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

export const viewOrders = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const response = await orderService.viewOrders(req.user)
        return sendAPIResponse(res, "orders", 200, response)
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

export const viewOrder = async (req : Request<Iparams>, res : Response, next : NextFunction) => {
    try{
        const response = await orderService.viewOrder(req.user, +req.params.id)
        return sendAPIResponse(res, "order", 200, response)
    }
    catch(err){
        next(err)
    }
}

export const changeOrderState = async (req : Request<Iparams>, res : Response, next : NextFunction) => {
    try{
        const response = await orderService.changeOrderState(req.user, +req.params.id, req.body)
        return sendAPIResponse(res, "order", 200, response)
    }
    catch(err){
        next(err)
    }
}

export const deleteOrder = async (req : Request<Iparams>, res : Response, next : NextFunction) => {
    try{
        await orderService.deleteOrder( req.user, +req.params.id)
        return sendAPIResponse(res, "prder deleted", 200)
    }
    catch(err){
        next(err)
    }
}