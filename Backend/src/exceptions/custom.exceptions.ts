import { HTTP_STATUS } from "../constant/http_status.constant"

export class APIError extends Error{
    public statusCode : number
    public details : any | null

    constructor(message : string, statusCode : number, details : any | null = null){
        super(message)
        this.name = "APIError"
        this.statusCode = statusCode
        this.details = details
    }
}

export class AuthenticationError extends APIError {
    constructor(name : string, message : string){
        super(message, HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED.CODE)
        this.name = name
    }
}

export class AuthotizationError extends APIError{
    constructor(message : string){
        super(message, HTTP_STATUS.CLIENT_ERROR.FORBIDDEN.CODE)
        this.name = "UNAUTHORIZED"
    }
}