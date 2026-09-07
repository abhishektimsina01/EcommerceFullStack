import {DataSource} from "typeorm"
import { getEnvProperty } from "../utils/getEnvPropery.utils"

export const appDataSource : DataSource = new DataSource({
    type : "mysql",
    host : "localhost",
    port : 3306,
    database:"ecommerceDb",
    username : getEnvProperty("db_username"),
    password : getEnvProperty("db_password"),
    entities : [],
    synchronize : true
})

export const connectDb = async () => {
    let tries : number = 1
    let status : boolean = false
    while(tries <= 5){
        try{
            await appDataSource.initialize()
            status = true
            break
        }
        catch(err){
            console.log(`${tries} try failed to connect db`)
            tries++
        }
    }
    if(status){
        console.log("Database connected successfully✅")
    }
    else{
        throw new Error("Database failed to connect❌")
    }
}