import { NextFunction, Request, Response } from "express";
import { withErrorHandling } from "../common/asyncHandler";
import { createChatService, getAllChatsService } from "../service/chat-service";
import { ErrorResponse, ResponseModel } from "../model/response/response";
import { ErrorMessages } from "../common/messages";


export const getChatMessages = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = res.locals.id
    const { chatId, limit, page } = req.params
    // Get chat messsages with chat.id from db
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
    const { id, email } = res.locals.user
    const { title } = req.body

    const result = await createChatService(id, title)
    if (result.error)
        throw new ErrorResponse(500, result.error.message)

    return res.json(new ResponseModel(201, ErrorMessages.SERVER.SUCCESS))
})