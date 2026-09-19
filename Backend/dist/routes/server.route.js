"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRoute = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const auth_routes_1 = require("./auth.routes");
const product_routes_1 = require("./product.routes");
const cart_routes_1 = require("./cart.routes");
const order_route_1 = require("./order.route");
const payment_routes_1 = require("./payment.routes");
const serverRoute = (app) => {
    app.use("/api", [
        auth_routes_1.authRouter,
        product_routes_1.productRouter,
        cart_routes_1.shopCartRouter,
        order_route_1.orderRouter,
        payment_routes_1.paymentRouter
    ]);
    app.use(error_middleware_1.notFound);
    app.use(error_middleware_1.errorHandler);
    console.log("routes registered✅");
};
exports.serverRoute = serverRoute;
