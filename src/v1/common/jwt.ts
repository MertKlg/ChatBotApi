import jwt, { JsonWebTokenError } from "jsonwebtoken"
import AppConfig from "../config/app-config"
import { IResult } from "../db/model/response/response-interface"



type Times = '15m' | '30d'

export const generateToken = (value: object, expires: Times) => {
    const secret = process.env.NODE_ENV == AppConfig.MODE.TEST ? process.env.TEST_SECRET_TOKEN : process.env.PRODUCTION_SECRET
    if (!secret)
        throw new Error("Secret is not defined")
    else if (!value)
        throw new Error("Value is not defined")

    return jwt.sign(value, secret, { expiresIn: expires, algorithm: "HS256", audience: "chatbot", issuer: "chatbot" })
}

export const validateToken = (token: string): IResult<string | jwt.JwtPayload> => {
    try {
        const secret = process.env.NODE_ENV == AppConfig.MODE.TEST ? process.env.TEST_SECRET_TOKEN : process.env.PRODUCTION_SECRET
        if (!secret)
            throw new Error("Secret is not defined")

        return {
            data: jwt.verify(token, secret, { algorithms: ["HS256"], audience: "chatbot", issuer: "chatbot" })
        }
    } catch (e) {
        if (e instanceof JsonWebTokenError) {
            return {
                error: new Error(e.message)
            }
        }

        return {
            error: new Error("Something went wrong")
        }
    }
}

export const validateTokenAsync = async (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const secret = process.env.NODE_ENV == AppConfig.MODE.TEST ? process.env.TEST_SECRET_TOKEN : process.env.PRODUCTION_SECRET
        if (!secret)
            return reject("Secret is not defined")

        resolve(jwt.verify(token, secret, { algorithms: ["HS256"], audience: "chatbot", issuer: "chatbot" }))
    })
}