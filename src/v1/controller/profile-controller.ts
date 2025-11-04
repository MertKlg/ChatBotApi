import { NextFunction, Request, Response } from "express";
import { withErrorHandling } from "../common/asyncHandler";
import { ResponseModel } from "../db/model/response/response";
import { ErrorMessages } from "../common/messages";

export const getProfile = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, user))
}) 