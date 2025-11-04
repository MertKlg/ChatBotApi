import { NextFunction, Request, Response } from "express";
import { queryWithErrorHandler, withErrorHandling } from "../common/asyncHandler";
import { createChatService, getAllChatsService } from "../service/chat-service";
import { ErrorResponse, ResponseModel } from "../db/model/response/response";
import { ErrorMessages } from "../common/messages";
import { IAiDTO } from "../db/model/ai/ai-interface";
import { getChatMessage, queryParticipantsDetails } from "../db/model/chat/chat-model";
import { GetChatMessageQueryResult, ResultParticipantsDetails } from "../db/model/chat/chat-interface";


export const getChatMessages = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user)
        throw new ErrorResponse(400, "Bad request")

    const { chatId } = req.params

    if (!chatId)
        throw new ErrorResponse(400, "Chat id not founded")
    // Get chat messsages with chat.id and user.id from db
    const result = await queryWithErrorHandler<GetChatMessageQueryResult[] | undefined>(() => getChatMessage({ chat_id: chatId, user_id: user.id }, undefined))
    if (result.error)
        throw new ErrorResponse(500, result.error.message)

    return res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, { "messages": result.data }))
})

// Get all chats of that users
export const getAllChat = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) {
        throw new ErrorResponse(401, "User not founded")
    }

    const result = await getAllChatsService(user?.id)
    if (result.error)
        throw new ErrorResponse(500, ErrorMessages.SERVER.INTERVAL_SERVER_ERROR)

    res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, result.data))
    return
})

export const createChat = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const { title, ai_models }: { title: string, ai_models: IAiDTO[] } = req.body
    console.log("request handled")
    if (!user) {
        throw new ErrorResponse(404, "User not founed")
    }

    const result = await createChatService(user.id, title, ai_models)
    if (result.error)
        throw new ErrorResponse(500, result.error.message)

    return res.json(new ResponseModel(201, ErrorMessages.SERVER.SUCCESS))
})


export const getChatDetails = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params
    const user = req.user
    if (!user)
        throw new ErrorResponse(400, "User not found")

    if (!chatId) {
        throw new ErrorResponse(400, ErrorMessages.SERVER.BAD_REQUEST)
    }

    const result = await queryWithErrorHandler<ResultParticipantsDetails[] | undefined>(() => queryParticipantsDetails({ chatId, userId: user.id }, undefined))
    console.log(result)
    if (result.error) {
        throw new ErrorResponse(500, result.error.message)
    }

    return res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, { "details": result.data }))
})