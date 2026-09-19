// we register all the middleware here
import {Application} from "express"
import morgan from "morgan"
import express from "express"
import cookieParser from "cookie-parser"
import { limiter } from "../config/ratelimiter.config"
import cors from "cors"

export const serverMiddleware = (app : Application) => {
    app.use(morgan("dev"))
    app.use(limiter)
    app.use(cors({ origin : true, credentials : true }))
    app.use(express.json())
    app.use(express.urlencoded({extended : true}))
    app.use(cookieParser())
    console.log("middleware registered✅")
}