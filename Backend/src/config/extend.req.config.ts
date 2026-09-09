import { Request } from "express"
import { ROLES } from "../enum/enums"

declare global {
    namespace Express{
        interface Request{
            user : {
                id : number,
                username : string,
                role : ROLES
            }
        }
    }
}