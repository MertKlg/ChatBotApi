import dotenv from "dotenv"
import express from "express"
import authRouter from "./router/auth-router"
import errorHandler from "./middleware/error-handler"
import AppConfig from "./config/app-config"
import { PostgreDatabase } from "./database"
import { RedisDatabase } from "./database-2"
import chatRouter from "./router/chat-router"
import { createServer } from "node:http"
import { Server } from "socket.io"
import { chatSocket } from "./socket"
import profileRouter from "./router/profile-router"
import AiRouter from "./router/ai-router"

dotenv.config({
    path: [".env.development", ".env.production", ".env"]
})

PostgreDatabase.getInstance().connect().then(() => {
    console.log("Connected to PostgreSQL")
}).catch((err) => {
    console.log("Failed to connect to PostgreSQL", err)
})

RedisDatabase.getInstance().connect().then(() => {
    console.log("Connected to Redis")
}).catch((err) => {
    console.log("Failed to connect to Redis", err)
})


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