import dotenv from "dotenv"
import redisDb from "./src/v1/db/redis-db"
import postgreDb from "./src/v1/db/postgre-db"



beforeAll(async () => {
    dotenv.config({
        path: [".env.development"]
    })

    try {
        await postgreDb.connect(process.env.TEST_DATABASE)

        await postgreDb.
    } catch (e) {
        console.error(e)
    }
})


afterAll(async () => {
    try {
        await postgreDb.close()
    } catch (e) {
        console.error(e)
    }
})