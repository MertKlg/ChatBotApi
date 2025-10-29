import { Server, Socket } from "socket.io"
import { userValidateMiddlewareSocket } from "../middleware/user-validate"
import { ErrorResponse, ResponseModel } from "../model/response/response"
import { ErrorMessages } from "../common/messages"
import { validateChatMessage } from "../validation/chat-validation"
import redisDb from "../db/redis-db"
import { findByChatId } from "../model/ai/ai-model"
import { askAiModels } from "../service/ai-service"
import { insert, insert as messageInsert } from "../model/chat/chat-model"
import { queryWithErrorHandler } from "../common/asyncHandler"
import postgreDb from "../db/postgre-db"
import { GetChatMessageQuery } from "../model/chat/chat-interface"
import { IErrorResponse } from "../model/response/response-interface"


export const chatSocket = (io: Server) => {

    io.use(userValidateMiddlewareSocket)

    io.on("connection", (socket: Socket) => {
        // User clicked a chat and it joining
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

                const answers = aiModels.map(async (e) => await askAiModels({
                    chat_id: chat_id,
                    content: content,
                    ai_model_id: e.id,
                    provider: e.provider,
                    model_identifier: e.model_identifier
                }))

                const results = await Promise.all(answers)

                const dbResult = await postgreDb.transaction(async (e) => {
                    const messages: GetChatMessageQuery[] = []
                    const errorMessages: IErrorResponse[] = []

                    const insertAiMessages = results.filter(e => e.data).map(async (message) => {
                        if (message.data) {
                            const { content, ai_model_id, chat_id } = message.data
                            const messageResult = await insert({ chat_id, is_from_ai: true, ai_model_id: ai_model_id, content: content, sender_id: null }, e)
                            if (messageResult) {
                                messages.push(messageResult)
                            }
                        } else {
                            errorMessages.push({ code: 500, message: "Something weng wrong", success: false })
                        }
                    })

                    await Promise.all(insertAiMessages)

                    await insert({ chat_id, is_from_ai: false, ai_model_id: null, content: content, sender_id: user_id }, e)

                    return {
                        data: messages,
                        error: new Error("Something went wrong")
                    }
                })

                socket.emit("sendMessageSuccess", new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, dbResult))
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
