import { NextFunction, Request, Response } from "express";
import { ErrorResponse, ResponseModel } from "../model/response/response";


export default (e : any,req : Request,res : Response, next : NextFunction) => {
    console.error(e)
    if(e instanceof ErrorResponse){
        // If error our ErrorRepsonse handle here
        return res.status(e.code ?? 500).json(e.toJson())
    }else{
        // If throw not same with up models handle here
        return res.status(500).json(new ErrorResponse(500, "Internal server error").toJson())
    }
}