import { NextFunction, Request, Response } from "express"
import { queryWithErrorHandler, withErrorHandling } from "../common/asyncHandler"
import { ErrorResponse, ResponseModel } from "../model/response/response"
import { ErrorMessages } from "../common/messages"
import { getAll } from "../model/ai/ai-model"


export const getAiModelsController = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const result = await queryWithErrorHandler(() => getAll(undefined))
    if (result.error) {
        throw new ErrorResponse(400, result.error.message)
    }
    res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, { "ai_models": result.data }))
})