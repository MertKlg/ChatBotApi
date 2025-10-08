import { Request, Response, NextFunction } from "express"
import { ErrorMessages } from "./messages";
import { IResult } from "../model/response/response-interface";

export const safeRun = async <T>(fn: () => Promise<IResult<T>>): Promise<IResult<T>> => {
  try {
    const process = await fn()
    return { data: process.data, error: process.error }
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e ?? ErrorMessages.SERVER.INTERVAL_SERVER_ERROR));
    return {error}
  }
};

export const withErrorHandling = (handler: Function) => {
    return async (req: Request, res: Response, next : NextFunction) => {
        try {
            return await handler(req, res, next);
        } catch (err) {
            return next(err)
        }
    };
}