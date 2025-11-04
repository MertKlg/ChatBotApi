interface IResponse {
    code: number,
    message: string,
    success: boolean
}

export interface IResult<T> {
    data?: T | undefined,
    error?: Error | undefined
}


export interface IErrorResponse<T = unknown> extends IResponse {
    details?: T | undefined,
}

export interface ISuccessResponse<T = unknown> extends IResponse {
    data?: T | undefined
}