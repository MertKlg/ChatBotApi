import { PostgreDatabase } from "./src/v1/database"
import dotenv from "dotenv"
import { RedisDatabase } from "./src/v1/database-2"


beforeAll(async () => {
    dotenv.config({
        path: [".development.env", ".production.env", ".env"]
    })

    console.log("setup not working !")

    try{
        await RedisDatabase.getInstance().connect()
        await PostgreDatabase.getInstance().connect()
    }catch(e){
        console.error(e)
    }
})


afterAll(async () => {
    try{
        RedisDatabase.getInstance().close()
        await PostgreDatabase.getInstance().close()
    }catch(e){
        console.error(e)
    }
})