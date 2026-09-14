import {createClient} from "redis"

// creating client of the redis server in docker
export const redisClient = createClient({
    url : "redis://localhost:6379"
})

// on disconnection
redisClient.on("error", (error) => {
    console.log("redis connection lost")
})

redisClient.on("ready", () => {
    console.log("redis is ready to be used")
})

// connection with the redis client
export const connectRedis = async () => {
    await redisClient.connect()
    console.log("redis connected✅")
}