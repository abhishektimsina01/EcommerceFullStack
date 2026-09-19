"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ratelimiter_config_1 = require("../config/ratelimiter.config");
const cors_1 = __importDefault(require("cors"));
const serverMiddleware = (app) => {
    app.use((0, morgan_1.default)("dev"));
    app.use(ratelimiter_config_1.limiter);
    app.use((0, cors_1.default)({ origin: true, credentials: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    console.log("middleware registered✅");
};
exports.serverMiddleware = serverMiddleware;
