import { NextFunction, Request, Response } from "express";
import { APIError } from "../exceptions/custom.exceptions";
import { sendErrorResponse } from "../utils/response.utils";

export const notFound = (req : Request, res : Response, next : NextFunction) => {
    const detail = [{
        endpoint : req.originalUrl,
        method : req.method,
        message : "not found"
    }]
    const err = new APIError("Page not found", 404, detail)
    next(err)
}

export const errorHandler = <T extends APIError>(err : T, req : Request, res : Response, next : NextFunction | null= null) => {
    console.log("error occurred❌")
    return sendErrorResponse(res, err.name, err.message, err.statusCode, err.details)
}