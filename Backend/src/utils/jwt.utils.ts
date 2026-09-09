import jwt from "jsonwebtoken"
import { IjwtData, Ipayload } from "../interface/interfaces";
import { getEnvProperty } from "./getEnvPropery.utils";
import { AuthenticationError } from "../exceptions/custom.exceptions";

export const signToken = (userData : IjwtData) => {
    // this is the data given to us after signUp or logIn
    const {id, username, role} = userData
    const access_token = jwt.sign({id, username, role}, getEnvProperty("access_token_secret_key"), {
        expiresIn : "1d"
    })
    const refresh_token = jwt.sign({id}, getEnvProperty("refresh_token_secret_key"), {
        expiresIn : "1d"
    })
    return {access_token, refresh_token}
}


export const verifyAccessToken = (token : string) => {
    try{
        const payload = jwt.verify(token, getEnvProperty("access_token_secret_key"))
        return payload as Ipayload
    }
    catch(err){
        if(err instanceof jwt.JsonWebTokenError){
            // token is tampered or different
            console.log(err.name)
            throw new AuthenticationError("LOGIN", "token has altered")
        }
        else if(err instanceof jwt.TokenExpiredError){
            // token has been expired
            console.log(err.name)
            throw new AuthenticationError("REFRESH_TOKEN", "token has expired")
        }
        else if(err instanceof jwt.NotBeforeError){
            // token used before made active
            throw new AuthenticationError("TOKEN_USED_BEFORE_ACTIVE", "token is not ready to be used")
        }
    }
}


export const verifyRefreshToken = (token : string) => {
    try{
        const payload = jwt.verify(token, getEnvProperty("refresh_token_secret_key"))
        return payload as Ipayload
    }
    catch(err){
        if(err instanceof jwt.JsonWebTokenError){
            // token is tampered or different
            console.log(err.name)
            throw new AuthenticationError("LOGIN", "token has altered")
        }
        else if(err instanceof jwt.TokenExpiredError){
            // token has been expired
            console.log(err.name)
            throw new AuthenticationError("LOGIN", "token has expired")
        }
        else if(err instanceof jwt.NotBeforeError){
            // token used before made active
            throw new AuthenticationError("TOKEN_USED_BEFORE_ACTIVE", "token is not ready to be used")
        }
    }
}