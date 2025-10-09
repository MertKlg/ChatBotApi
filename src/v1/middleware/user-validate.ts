import { NextFunction, Request, Response } from "express";
import { withErrorHandling } from "../common/asyncHandler";
import { ErrorResponse } from "../model/response/response";
import { validateTokenAsync } from "../common/jwt";
import { ErrorMessages } from "../common/messages";
import { Event, Socket } from "socket.io";
import { findUserById } from "../model/auth/auth-model";

// A basic handle verify user middleware
export const userValidateMiddleware = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    // If we want validate user we need check jwt token
    const token = req.headers.authorization
    if (!token)
        throw new ErrorResponse(403, "Permission denied")

    if (token.split(' ')[0] !== "Bearer")
        throw new ErrorResponse(403, "Permission denied")

    const bearerToken = token.split(' ')[1]
    if (!bearerToken)
        throw new Error("Something went wrong")

    const validateToken = await validateTokenAsync(bearerToken)
    const findUser = await findUserById(validateToken.user_id)
    if (!findUser)
        throw new ErrorResponse(401, ErrorMessages.SERVER.Unauthorized)
    req.user = findUser
    next()
})

export const userValidateMiddlewareSocket = async (socket: Socket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.token
        if (!token)
            throw new Error("Token not defined")
        const decodedToken = await validateTokenAsync(token)
        socket.data.user = { id: decodedToken.id, email: decodedToken.email }

        const tokenExpInSecond = decodedToken.exp
        const nowInSeconds = Math.floor(Date.now() / 1000)
        const expiresInMillisecond = (tokenExpInSecond - nowInSeconds) * 1000

        if (expiresInMillisecond < 0) {
            return next(new Error("Token expired"))
        }

        const disconnectTimer = setTimeout(() => {
            socket.disconnect(true)
        }, expiresInMillisecond);

        socket.on('disconnect', () => {
            clearTimeout(disconnectTimer)
        })

        socket.join(decodedToken.id)

        next()
    } catch (e) {
        next(e instanceof Error ? e : new Error(ErrorMessages.SERVER.INTERVAL_SERVER_ERROR))
    }
}
