import { IAuth } from "../../src/v1/db/model/auth/auth-interface";

declare module 'express' {
    export interface Request {
        user?: IAuth
    }
}