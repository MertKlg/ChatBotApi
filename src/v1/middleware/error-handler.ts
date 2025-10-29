import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../model/response/response";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";


export default (e: any, req: Request, res: Response, next: NextFunction) => {
    console.error(e)
    if (e instanceof ErrorResponse) {
        // If error our ErrorRepsonse handle here
        return res.status(e.code ?? 500).json(e.toJson())
    } else if (e instanceof TokenExpiredError) {
        return res.status(401).json(new ErrorResponse(401, e.message).toJson())
    } else if (e instanceof JsonWebTokenError) {
        return res.status(500).json(new ErrorResponse(500, e.message).toJson())
    } else {
        // If throw not same with up models handle here
        return res.status(500).json(new ErrorResponse(500, "Internal server error").toJson())
    }
}