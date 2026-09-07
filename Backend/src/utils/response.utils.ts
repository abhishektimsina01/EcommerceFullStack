import { Response } from "express";
import { detailType } from "../types/types";

export const sendErrorResponse = <T>(res : Response, name : string, message : string, statusCode : number, details : detailType<T>) => {
    return res.status(statusCode).json({
        error : true,
        name : name,
        message : message,
        details : details
    })
}

export const sendAPIResponse = <T>(res : Response, message : string, statusCode : number, details : detailType<T> = null) => {
    return res.status(statusCode).json({
        error : false,
        message : message,
        details : details
    })
}