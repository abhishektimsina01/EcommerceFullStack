import dotenv from "dotenv"
import { APIError } from "../exceptions/custom.exceptions"
dotenv.config()

export const getEnvProperty = (key : string): string => {
    if(Object.hasOwn(process.env, key)){
        const value = process.env[key]
        if(value != "" && value != undefined){
            return value
        }
    }
    throw new APIError("no env key found", 404)
}