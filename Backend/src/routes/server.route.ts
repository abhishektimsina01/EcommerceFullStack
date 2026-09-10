// we register all the routes with the endpoint here
import { Application } from "express";
import { errorHandler, notFound } from "../middleware/error.middleware";
import { authRouter } from "./auth.routes";
import { productRouter } from "./product.routes";

export const serverRoute = (app : Application) => {
    app.use("/api", [
        authRouter,
        productRouter
    ])
    app.use(notFound)
    app.use(errorHandler)
    console.log("routes registered✅")
}