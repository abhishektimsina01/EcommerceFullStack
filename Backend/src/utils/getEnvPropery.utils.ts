import dotenv from "dotenv"
dotenv.config()

export const getEnvProperty = (key : string) => {
    if(Object.hasOwn(process.env, key)){
        if(process.env[key] == "" && process.env.key == undefined){
            throw new Error("no env key found")
        }
        else{
            return process.env[key]
        }
    }
}