import { Server, Socket } from "socket.io"
import { userValidateMiddlewareSocket } from "../middleware/user-validate"
import { ErrorResponse, ResponseModel } from "../db/model/response/response"
import { ErrorMessages } from "../common/messages"
import { validateChatMessage } from "../validation/chat-validation"
import { findByChatId } from "../db/model/ai/ai-model"
import { askAiModels } from "../service/ai-service"
import { insertMessageWithReturningService } from "../service/chat-service"


export const chatSocket = (io: Server) => {

    io.use(userValidateMiddlewareSocket)

    io.on("connection", (socket: Socket) => {
        const { user_id } = socket.data.user
        console.log(user_id)
        // User sending message
        socket.on("sendMessage", async (data: any) => {
            try {
                // Zod validation
                const validatedMessage = await validateChatMessage.safeParseAsync(data)
                if (validatedMessage.error) {
                    socket.emit("sendMessageError", new ErrorResponse(400, ErrorMessages.SERVER.BAD_REQUEST, false, [validatedMessage.error]))
                    return
                }
                const { chat_id, content } = validatedMessage.data

                // Get chat participants ai models
                const aiModels = await findByChatId({ id: chat_id }, undefined)

                const userMessage = await insertMessageWithReturningService({ chat_id, content, sender_id: user_id, is_from_ai: false, ai_model_id: null })
                if (userMessage.error) {
                    socket.emit("sendMessageError", new ErrorResponse(500, "Something went wrong"))
                    return
                }
                socket.emit("sendMessageSuccess", new ResponseModel(200, "Success", true, { messages: [userMessage.data] }))

                const answers = aiModels.map(async (e) => await askAiModels({
                    chat_id: chat_id,
                    content: content,
                    ai_model_id: e.id,
                    provider: e.provider,
                    model_identifier: e.model_identifier
                }))

                const results = await Promise.all(answers)

                const combine = results.map(e => {
                    return {
                        "messages": e.data,
                        "errors": e.error
                    }
                })

                socket.emit("sendMessageSuccess", new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, combine[0]))
            } catch (e) {
                const messageHandle = e instanceof Error ? e.message : ErrorMessages.SERVER.INTERVAL_SERVER_ERROR
                socket.emit("sendMessageError", new ErrorResponse(500, messageHandle))
            }
        })
    })
}