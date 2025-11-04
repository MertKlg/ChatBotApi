import { Request, Response, NextFunction } from "express"
import { IResult } from "../db/model/response/response-interface";

export const withErrorHandling = (handler: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await handler(req, res, next);
    } catch (err) {
      return next(err)
    }
  };
}

export const queryWithErrorHandler = async<T>(fn: () => Promise<T>): Promise<IResult<T>> => {
  try {
    return {
      data: await fn()
    }
  } catch (e) {
    return {
      error: (e instanceof Error ? e : new Error("Something went wrong"))
    }
  }
}