"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
// creating client of the redis server in docker
exports.redisClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379"
});
// on disconnection
exports.redisClient.on("error", (error) => {
    console.log("redis connection lost");
});
exports.redisClient.on("ready", () => {
    console.log("redis is ready to be used");
});
// connection with the redis client
const connectRedis = async () => {
    await exports.redisClient.connect();
    console.log("redis connected✅");
};
exports.connectRedis = connectRedis;
