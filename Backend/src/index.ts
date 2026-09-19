import { Express } from "express"
import express from "express"
import { connectDb } from "./database/connect.db"
import { serverMiddleware } from "./middleware/server.middleware"
import { serverRoute } from "./routes/server.route"
import { getEnvProperty } from "./utils/getEnvPropery.utils"
import { connectRedis } from "./config/redis.config"


export const appConfiguration = async () => {
    try{
        const app : Express = express()
        await connectDb()
        await connectRedis()
        serverMiddleware(app)
        app.use("/uploads", express.static("uploads"))
        serverRoute(app)
        app.listen(getEnvProperty("port"), (err) => {
            if(err){
                console.log("Server couldnot start")
                console.log(err.message)
            }
            else{
                console.log("Server has started successfully.✅")
            }
        })
    }
    catch(err){
        if(err instanceof Error){
            console.log(err.message)
        }
    }
}