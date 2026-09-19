"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfiguration = void 0;
const express_1 = __importDefault(require("express"));
const connect_db_1 = require("./database/connect.db");
const server_middleware_1 = require("./middleware/server.middleware");
const server_route_1 = require("./routes/server.route");
const getEnvPropery_utils_1 = require("./utils/getEnvPropery.utils");
const redis_config_1 = require("./config/redis.config");
const appConfiguration = async () => {
    try {
        const app = (0, express_1.default)();
        await (0, connect_db_1.connectDb)();
        await (0, redis_config_1.connectRedis)();
        (0, server_middleware_1.serverMiddleware)(app);
        app.use("/uploads", express_1.default.static("uploads"));
        (0, server_route_1.serverRoute)(app);
        app.listen((0, getEnvPropery_utils_1.getEnvProperty)("port"), (err) => {
            if (err) {
                console.log("Server couldnot start");
                console.log(err.message);
            }
            else {
                console.log("Server has started successfully.✅");
            }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
};
exports.appConfiguration = appConfiguration;
