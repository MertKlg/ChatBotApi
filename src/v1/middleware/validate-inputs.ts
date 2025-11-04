import { NextFunction, Request, Response } from "express"
import { withErrorHandling } from "../common/asyncHandler"
import { validationResult, ValidationError } from "express-validator"
import { ErrorResponse } from "../db/model/response/response"

export const validateInputs = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const validResult = validationResult(req)
    if (validResult.isEmpty()) {
        next()
        return
    }

    const formattedResult: Record<string, string> = {}

    for (let value in validResult.mapped()) {
        if (!formattedResult[value]) {
            const result = JSON.parse(JSON.stringify(validResult.mapped()[value]))
            formattedResult[value] = result.msg
        }
    }

    next(new ErrorResponse(401, "Validation error", false, formattedResult))
})