import { Router } from "express";
import { refresh, signIn, signUp } from "../controller/auth-controller";
import { body, ValidationChain } from "express-validator"
import AppConfig from "../config/app-config";
import { ErrorMessages } from "../common/messages";
import { validateInputs } from "../middleware/validate-inputs";
import refreshTokenValid from "../middleware/refresh-token-valid";

const authRouter = Router()

authRouter.post("/sign-in", [
    body("email")
        .trim()
        .escape()
        .normalizeEmail()
        .notEmpty().withMessage(ErrorMessages.VALIDATION_ERROR.EMAIL_EMPTY)
        .isEmail().withMessage(ErrorMessages.VALIDATION_ERROR.EMAIL_NOT_VALIDATED),

    body("password")
        .escape()
        .trim()
        .notEmpty()
        .withMessage(ErrorMessages.VALIDATION_ERROR.PASSWORD_EMPTY)
        .isLength({
            min: AppConfig.passwordLength.min,
            max: AppConfig.passwordLength.max
        }).withMessage(ErrorMessages.VALIDATION_ERROR.PASSWORD_LENGTH),

    body("client")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Client won't be empty")
    .custom((client) => {
        if(!AppConfig.ALLOWED_CLIENTS.includes(client))
            throw new Error("Invalid client")

        return true
    }),
    validateInputs
], signIn)

authRouter.post("/sign-up", [
    body("username")
        .trim()
        .escape()
        .notEmpty()
        .withMessage(ErrorMessages.VALIDATION_ERROR.USERNAME_EMPTY)
        .isLength({ min: AppConfig.usernameLength.min, max: AppConfig.usernameLength.max })
        .withMessage(ErrorMessages.VALIDATION_ERROR.USERNAME_LENGTH),

    body("email")
        .trim()
        .escape()
        .normalizeEmail()
        .notEmpty().withMessage(ErrorMessages.VALIDATION_ERROR.EMAIL_EMPTY)
        .isEmail().withMessage(ErrorMessages.VALIDATION_ERROR.EMAIL_NOT_VALIDATED),

    body("password")
        .escape()
        .trim()
        .notEmpty()
        .withMessage(ErrorMessages.VALIDATION_ERROR.PASSWORD_EMPTY)
        .isLength({
            min: AppConfig.passwordLength.min,
            max: AppConfig.passwordLength.max
        }).withMessage(ErrorMessages.VALIDATION_ERROR.PASSWORD_LENGTH),

    body("passwordAgain")
        .escape()
        .trim()
        .notEmpty()
        .withMessage(ErrorMessages.VALIDATION_ERROR.PASSWORD_EMPTY)
        .isLength({
            min: AppConfig.passwordLength.min,
            max: AppConfig.passwordLength.max
        }).withMessage(ErrorMessages.VALIDATION_ERROR.PASSWORD_LENGTH)
        .custom((value, { req }) => {
            if(value !== req.body.password){
                throw new Error(ErrorMessages.VALIDATION_ERROR.PASSWORDS_NOT_MATCH)
            }
            return true
        }),
        validateInputs
],signUp)

authRouter.post("/refresh",[body("client")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Client won't be empty")
    .custom((client) => {
        if(!AppConfig.ALLOWED_CLIENTS.includes(client))
            throw new Error("Invalid client")

        return true
    }),validateInputs,refreshTokenValid] ,refresh)


export default authRouter 