import dotenv from "dotenv"
import redisDb from "./src/v1/db/redis-db"
import postgreDb from "./src/v1/db/postgre-db"



beforeAll(async () => {
    dotenv.config({
        path: [".development.env", ".production.env", ".env"]
    })

    console.log("setup not working !")

    try {
        await redisDb.connect()
        await postgreDb.connect()
    } catch (e) {
        console.error(e)
    }
})


afterAll(async () => {
    try {
        redisDb.close()
        await postgreDb.close()
    } catch (e) {
        console.error(e)
    }
})