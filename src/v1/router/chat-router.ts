import { Router } from "express";
import { userValidateMiddleware } from "../middleware/user-validate";
import { createChat, getAllChat, getChatDetails, getChatMessages } from "../controller/chat-controller";
import { body, param, query } from "express-validator";
import { validateInputs } from "../middleware/validate-inputs";
import { findByParams } from "../db/model/ai/ai-model";

const chatRouter = Router()

chatRouter.post("/create", [
    userValidateMiddleware,
    body("title")
        .escape()
        .trim()
        .notEmpty()
        .withMessage("Chat title won't be empty"),

    body("ai_models.*.id")
        .escape()
        .trim()
        .notEmpty()
        .withMessage("Ai model won't be empty")
        .custom(async (value, { req }) => {
            const valueMustBeAs = value as { id: string, model_identifier: string }
            const validateModels = await findByParams({ id: valueMustBeAs.id }, undefined)
            if (validateModels.length < 0) {
                throw new Error("No Ai model founded")
            }
            return true
        }),
    validateInputs
], createChat)


chatRouter.get("/:chatId/message/", [
    userValidateMiddleware,
    param("chatId")
        .escape()
        .trim()
        .notEmpty()
        .withMessage("Chat id is not to be empty"),
    validateInputs
], getChatMessages)

chatRouter.get("/getAll", [
    userValidateMiddleware
], getAllChat)

chatRouter.get("/details/:chatId", [
    userValidateMiddleware,
    param("chatId")
        .escape()
        .trim()
        .notEmpty()
        .withMessage("Chat id could be not empty"),
    validateInputs
], getChatDetails)

export default chatRouter