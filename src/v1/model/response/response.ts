import { IErrorResponse, ISuccessResponse } from "./response-interface";


export class ErrorResponse<T> implements IErrorResponse<T>, Error {

    constructor(
        public readonly code: number,
        public readonly message: string,
        public readonly success: boolean = false,
        public readonly details?: T,
        public readonly name: string = "ErrorResponse"
    ) { }

    toJson(): IErrorResponse<T> {
        return {
            code: this.code,
            message: this.message,
            success: this.success,
            details: this.details
        }
    }
}

export class ResponseModel<T> implements ISuccessResponse<T> {
    constructor(
        public readonly code: number,
        public readonly message: string,
        public readonly success: boolean = true,
        public readonly data?: T
    ) { }

    toJson() {
        return {
            code: this.code,
            message: this.message,
            success: this.success,
            data: this.data
        }
    }
}


