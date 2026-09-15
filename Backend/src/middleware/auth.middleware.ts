import { NextFunction, Request, Response } from "express";
import { ROLES } from "../enum/enums";
import { AuthenticationError, AuthotizationError } from "../exceptions/custom.exceptions";
import { verifyAccessToken } from "../utils/jwt.utils";
import { IjwtData, Ipayload } from "../interface/interfaces";
import { UserRepository } from "../repository/user.repository";
import { error } from "node:console";

const userRepo = new UserRepository()

export const authenticate = async (req : Request, res : Response, next : NextFunction) => {
    try{
        // try to access the token from the cookie
        const {access_token} = req.cookies
        if(!access_token){
            throw new AuthenticationError("LOGIN", "no token found please login")
        }
        const payload : Ipayload = verifyAccessToken(access_token) as Ipayload
        const user = await userRepo.findUser("user_id", payload.id)
        if(!user){
            throw new AuthenticationError("USER_NOT_FOUND", "no user was found")
        }
        req.user = {
            id : payload.id,
            username : payload.username,
            role : payload.role
        }
        next()
    }
    catch(err){
        next(err)
    }
}

export const authorize = (...roles : any) => {
    return (req : Request, res : Response, next : NextFunction) => {
        try{
            if(roles.includes(req.user.role)){
                next()
            }
            else{
                const err = new AuthotizationError(`${req.user.role} not authorized`)
                throw err
            }
        }
        catch(err){ 
            next(err)
        }
    }
}