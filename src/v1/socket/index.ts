import { Server, Socket } from "socket.io"
import { userValidateMiddlewareSocket } from "../middleware/user-validate"
import { ErrorResponse, ResponseModel } from "../model/response/response"
import { ErrorMessages } from "../common/messages"
import { GoogleGenAI } from "@google/genai"
import { validateChatMessage } from "../validation/chat-validation"
import { RedisDatabase } from "../database-2"


const googleAi = new GoogleGenAI({
    apiKey: `${process.env.GEMINI_KEY}`
})


export const chatSocket = (io: Server) => {

    io.use(userValidateMiddlewareSocket)

    io.on("connection", (socket: Socket) => {
        // User clicked a chat and it joining
        socket.on("joinChatRoom", async (data: any) => {
            try {
                const { chat_id } = data

                console.log("user connected the room", chatSocket, socket.id)

                if (!chat_id)
                    throw new Error("Chat not founded")

                socket.join(chat_id)

            } catch (e) {

            }
        })

        socket.on("leaveChatRoom", (data: any) => {
            try {
                const { chat_id } = data
                if (!chat_id)
                    throw new Error("Chat not founded")

                socket.leave(chat_id)
            } catch (e) {

            }
        })

        // User sending message
        socket.on("sendMessage", async (data: any) => {
            try {
                const { id, email } = socket.data.user
                // Zod validation
                const validatedMessage = await validateChatMessage.safeParseAsync(data)
                if (validatedMessage.error) {
                    socket.emit("sendMessageError", new ErrorResponse(400, ErrorMessages.SERVER.BAD_REQUEST, false, [validatedMessage.error]))
                    return
                }

                const userMessageDto = { content: validatedMessage.data.content, chat_id: validatedMessage.data.chat_id, type: validatedMessage.data.type, sender_id: id }
                const randomUUID = crypto.randomUUID()
                RedisDatabase.getInstance().setValue(`${id}-${randomUUID}`, userMessageDto)

                // User sending message when message is validated send to ai model
                switch (validatedMessage.data.type) {
                    case "gemini-2.5-flash":
                        // Ask gemini flash
                        const gemRes = await googleAi.models.generateContent({
                            model: "gemini-2.5-flash",
                            contents: userMessageDto.content
                        })

                        RedisDatabase.getInstance().remove(`${id}-${randomUUID}`)

                        socket.emit("getNewMessage", new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, gemRes.data))
                        break;

                    default:
                        throw new ErrorResponse(500, "No AI founded")
                        break
                }
            } catch (e) {
                const messageHandle = e instanceof Error ? e.message : ErrorMessages.SERVER.INTERVAL_SERVER_ERROR
                socket.emit("sendMessageError", new ErrorResponse(500, messageHandle))
            }
        })


        socket.on("deleteMessage", async (data: any) => {

        })

        socket.on("editMessage", (data: any) => {

        })
    })
}
