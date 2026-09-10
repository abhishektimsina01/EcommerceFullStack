import { NextFunction, Request, response, Response } from "express";
import { ILogIn } from "../interface/interfaces";
import { loginScheam } from "../validation/auth.validation";
import { ValidationError } from "../exceptions/custom.exceptions";
import { sendAPIResponse } from "../utils/response.utils";
import { HTTP_STATUS } from "../constant/http_status.constant";
import { AuthService } from "../service/auth.service";
import { setCookies } from "../utils/cookies.utils";
import { ROLES } from "../enum/enums";
import { SignupSchema } from "../constant/schema.mapper.constant";

const authService = new AuthService()

export const authLogIn = async(req : Request, res : Response, next : NextFunction) => {
    try{
        const userData : ILogIn = req.body
        const {error} = loginScheam.validate(userData)
        if(error){
            throw new ValidationError(error)
        }
        const response = await authService.loginService(userData)
        const {access_token, refresh_token, ...safeData} = response
        setCookies(res, "access_token", access_token)
        setCookies(res, "refresh_token", refresh_token)
        return sendAPIResponse(res, "Logged In", HTTP_STATUS.SUCCESS.OK.CODE, {...safeData, access_token, refresh_token})
    }
    catch(err){
        next(err)
    }
}

export const authSignUp = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const role = req.body.role
        const {error} = SignupSchema[role as Exclude<ROLES, ROLES.ADMIN>].validate(req.body)
        if(error){
            throw new ValidationError(error)
        }
        const response = await authService.signupService(req.body)
        const {access_token, refresh_token, ...safeData} = response
        setCookies(res, "access_token", access_token)
        setCookies(res, "refresh_token", refresh_token)
        return sendAPIResponse(res, "user regsitered", HTTP_STATUS.SUCCESS.OK.CODE, response)
    }
    catch(err){
        next(err)   
    }

}

export const authLogOut = (req : Request, res : Response, next : NextFunction) => {
    res.clearCookie("access_token")
    res.clearCookie("refresh_token")
    return sendAPIResponse(res, "Logged Out", 200)
}