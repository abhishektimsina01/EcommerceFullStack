import { NextFunction, Request, Response } from "express";
import { ROLES } from "../enum/enums";
import { AuthotizationError } from "../exceptions/custom.exceptions";

export const authenticate = (req : Request, res : Response, next : NextFunction) => {
    try{
        // verify the token and extract the payload
    }
    catch(err){
        next(err)
    }
}

export const authorize = (...roles : ROLES[]) => {
    return (req : Request, res : Response, next : NextFunction) => {
        try{
            if(roles.includes(req.user.role)){
                next()
            }
            const err = new AuthotizationError(`${req.user.role} not authorized`)
            throw err
        }
        catch(err){ 
            next(err)
        }
    }
}