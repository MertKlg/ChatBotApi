import dotenv from "dotenv"
import express from "express"
import authRouter from "./router/auth-router"
import errorHandler from "./middleware/error-handler"
import AppConfig from "./config/app-config"
import chatRouter from "./router/chat-router"
import { createServer } from "node:http"
import { Server } from "socket.io"
import { chatSocket } from "./socket"
import profileRouter from "./router/profile-router"
import AiRouter from "./router/ai-router"
import redisDb from "./db/redis-db"
import postgreDb from "./db/postgre-db"

dotenv.config({
    path: [".env.development", ".env.production", ".env"]
})

redisDb.connect()
postgreDb.connect(process.env.DATABASE_URL)



const app = express()
const server = createServer(app)
chatSocket(new Server(server))


app.use(express.json())
app.use("/auth", authRouter)
app.use("/chat", chatRouter)
app.use("/profile", profileRouter)
app.use("/ai", AiRouter)
app.use(errorHandler)


if (process.env.NODE_ENV == AppConfig.MODE.TEST) {
    server.listen(process.env.PORT || 3001, () => {
        console.log("Working on development mode", process.env.PORT)
        console.log(process.env.PORT)
    })
}


export default app