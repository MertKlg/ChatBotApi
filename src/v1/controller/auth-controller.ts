import { NextFunction, Request, Response } from "express"
import { withErrorHandling } from "../common/asyncHandler"
import { ErrorResponse, ResponseModel } from "../db/model/response/response"
import { refreshToken, registerUser, signInUser } from "../service/auth-service"
import { ErrorMessages } from "../common/messages"

export const signIn = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, client }: { email: string, password: string, client: string } = req.body
    const result = await signInUser({ email, password, client })

    if (result.error) {
        throw new ErrorResponse(400, result.error.message)
    }

    if (client === "web") {
        // Send token to web
        const refreshToken = result.data?.refresh_token
        const accessToken = result.data?.access_token
        res.cookie("refresh_token", refreshToken, { secure: true, path: "/api/refresh", expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), httpOnly: true, sameSite: "strict" })
        res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, { access_token: accessToken }))
        return
    } else {
        const refreshToken = result.data?.refresh_token
        const accessToken = result.data?.access_token
        res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, { access_token: accessToken, refresh_token: refreshToken }))
        return
    }
})

export const signUp = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password }: { username: string, email: string, password: string } = req.body

    const register = await registerUser({ username, email, password, passwordAgain: password })

    // Register might be send error
    if (register.error) {
        throw new ErrorResponse(400, register.error.message)
    }

    // If we won't get any error message
    return res.json(new ResponseModel(201, ErrorMessages.SERVER.SUCCESS, true))
})

export const refresh = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {
    const { id, hash } = res.locals.currentToken
    const { user_id, client } = res.locals.jwtPayload

    const token = await refreshToken({ id, user_id: user_id, client: client, expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), token: "" })
    if (token.error)
        throw new ErrorResponse(500, ErrorMessages.SERVER.INTERVAL_SERVER_ERROR)

    if (client == "web") {
        res.cookie("refresh_token", token.data?.refresh_token, { sameSite: "strict", path: "/auth/refresh", expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) })
        res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, { access_token: token.data?.access_token }))
        return
    } else {
        res.json(new ResponseModel(200, ErrorMessages.SERVER.SUCCESS, true, { access_token: token.data?.access_token, refresh_token: token.data?.refresh_token }))
        return
    }
})

export const logOut = withErrorHandling(async (req: Request, res: Response, next: NextFunction) => {

})
