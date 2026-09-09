import { Response } from "express";

export const setCookies = (res : Response, key : string, value : string) => {
    res.cookie(key, value, {
        maxAge : 1000 * 60 *60 * 24,
        sameSite : "strict",
        secure : true,
        httpOnly : true
    })
}