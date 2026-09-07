import {createClient} from "redis"

export const redisClient = createClient({
    url : "redis://localhost:6379"
})

redisClient.on("error", (error) => {
    console.log("redis connection lost")
})

export const connectRedis = async () => {
    await redisClient.connect()
    console.log("redis connected✅")
}