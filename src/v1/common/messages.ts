import AppConfig from "../config/app-config";

enum ErrorCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    USER = "USER",
    SERVER = "SERVER"
}


export const ErrorMessages = {
    [ErrorCode.VALIDATION_ERROR] : {
        "USERNAME_LENGTH" : `Username must be between ${AppConfig.usernameLength.min}-${AppConfig.usernameLength.max} characters long`,
        "EMAIL_NOT_VALIDATED" : "Email address not validated",
        "PASSWORD_LENGTH" : `Password must be between ${AppConfig.passwordLength.min}-${AppConfig.passwordLength.max} characters long`,
        "USERNAME_EMPTY" : "Username can not be empty",
        "EMAIL_EMPTY" : "Email can not be empty",
        "PASSWORD_EMPTY" : "Password can not be empty",
        "PASSWORDS_NOT_MATCH" : "Passwords do not match"
    },
    [ErrorCode.USER] : {
        "USER_NOT_FOUND" : "User not found",
        "USER_ALREADY_EXISTS" : "User already exists",
        "USER_CREATED" : "Account created",
        "WRONG_PASSWORD" : "Wrong password"
    },
    [ErrorCode.SERVER] : {
        "INTERVAL_SERVER_ERROR" : "Interval server error",
        "SUCCESS" : "Success",
        "BAD_REQUEST" : "Bad Request",
        "Unauthorized" : "Unauthorized"
    }
}