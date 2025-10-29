import { IResult } from "../model/response/response-interface";
import { LoginUserDto, RegisterUserDto } from "../model/user/user-interface";
import { createRefreshToken, createUser, deleteRefreshToken, findRefreshTokenByToken, findUserByEmail, findUserPassword } from "../model/auth/auth-model";
import { ErrorMessages } from "../common/messages";
import { compare, hashData, hashValue } from "../common/bcrypt";
import { generateToken } from "../common/jwt";
import { RefreshToken } from "../model/auth/auth-interface";
import crypto from "crypto"
import postgreDb from "../db/postgre-db";

export const registerUser = async (data: RegisterUserDto): Promise<IResult<string>> => {
    const result = await postgreDb.transaction(async (e) => {
        const findUser = await findUserByEmail(data.email, e)
        if (findUser) {
            throw new Error(ErrorMessages.USER.USER_ALREADY_EXISTS)
        }

        const hashPassword = await hashData(data.password)
        if (!hashPassword)
            throw new Error(ErrorMessages.SERVER.INTERVAL_SERVER_ERROR)

        await createUser({ id: crypto.randomUUID(), email: data.email, password: hashPassword }, e)

        return { data: ErrorMessages.USER.USER_CREATED }
    })

    return result
}

export const signInUser = async (data: LoginUserDto): Promise<IResult<{ access_token: string, refresh_token: string }>> => {
    const res = await postgreDb.transaction(async (e) => {
        const findUser = await findUserByEmail(data.email, e)
        if (!findUser)
            throw new Error(ErrorMessages.USER.USER_NOT_FOUND)


        const userPassword = await findUserPassword(findUser.id, e)
        if (!userPassword)
            throw new Error(ErrorMessages.USER.USER_NOT_FOUND)


        const passwordIsTrue = await compare(data.password, userPassword.password)
        if (!passwordIsTrue)
            throw new Error(ErrorMessages.USER.WRONG_PASSWORD)

        // If the user is successfully logged in
        const refreshToken = crypto.randomUUID()
        const hashToken = hashValue(refreshToken)
        await createRefreshToken({ user_id: findUser.id, token: hashToken, client: data.client, expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) }, e)

        return {
            data: {
                access_token: generateToken({ user_id: findUser.id, jti: crypto.randomUUID() }, '15m'),
                refresh_token: refreshToken
            }
        }
    })

    return res
}

export const refreshToken = async (data: RefreshToken): Promise<IResult<{ access_token: string, refresh_token: string }>> => {
    const result = await postgreDb.transaction(async (e) => {
        // Generate new token
        const access_token = generateToken({ user_id: data.user_id, jti: crypto.randomUUID() }, '15m')

        await deleteRefreshToken(data.id, e)
        // If token deleted create one
        const refreshToken = crypto.randomUUID()
        const hashToken = hashValue(refreshToken)
        await createRefreshToken({ user_id: data.user_id, token: hashToken, client: data.client, expiresAt: data.expiresAt }, e)

        return { data: { access_token, refresh_token: refreshToken } }
    })

    return result
}