import { NextFunction, Request, Response } from "express"
import { withErrorHandling } from "../common/asyncHandler"
import { ErrorResponse } from "../model/response/response"
import { ErrorMessages } from "../common/messages"
import { hashValue } from "../common/bcrypt"
import { deleteRefreshToken, findRefreshTokenByToken } from "../model/auth/auth-model"

export default withErrorHandling(async (req : Request, res : Response, next : NextFunction) => {
    const {client} = req.body

    let plainToken : string | undefined

    if(client === "web")
        plainToken = req.cookies.refresh_token
    else 
        plainToken = req.body.refresh_token

    if(!plainToken)
        throw new ErrorResponse(401, ErrorMessages.SERVER.Unauthorized)

    // Check refresh token on db
    const hashedToken = hashValue(plainToken)

    const findToken = await findRefreshTokenByToken(hashedToken, undefined)
    if(!findToken)
        throw new ErrorResponse(401, ErrorMessages.SERVER.Unauthorized)

    if(findToken.expires_at.getTime() < Date.now()){
        // If token expired delete exists token and throw error
        // And block access_token
        deleteRefreshToken(findToken.id, undefined)
        throw new ErrorResponse(401, "Token expired")
    }

    res.locals.jwtPayload = {
        user_id : findToken.user_id,
        client : findToken.client
    }

    res.locals.currentToken = {
        id : findToken.id,
        hash : hashedToken
    }
    next()
})