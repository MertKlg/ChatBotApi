import { NextFunction, Request, Response } from "express"
import { withErrorHandling } from "../common/asyncHandler"
import { ResponseModel } from "../model/response/response"
import { ErrorMessages } from "../common/messages"
import { getAllAiModelsService } from "../service/ai-service"


export const getAiModelsController = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAllAiModelsService()
    res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, { "ai_models": result.data }))
})