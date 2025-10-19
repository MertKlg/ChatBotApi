import { Router } from "express";
import { userValidateMiddleware } from "../middleware/user-validate";
import { createChat, getAllChat, getChatMessages } from "../controller/chat-controller";
import { body, param, query } from "express-validator";
import { validateInputs } from "../middleware/validate-inputs";
import { CreateChatValidation } from "../validation/chat-validation";
import { findAiModel } from "../model/ai/ai-model";

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
            const validateModels = await findAiModel({ id: valueMustBeAs.id }, undefined)
            if (validateModels.length < 0) {
                throw new Error("No Ai model founded")
            }
            return true
        }),
    validateInputs
], createChat)


chatRouter.get("/chat/{chatId}/message/page=1&limit=50", [
    userValidateMiddleware,
    param("chatId")
        .escape()
        .trim()
        .notEmpty()
        .withMessage("Chat id is not to be empty"),
    query("page")
        .escape()
        .trim()
        .isNumeric()
        .withMessage("Page must be a numeric"),
    query("limit")
        .escape()
        .trim()
        .isNumeric()
        .withMessage("Limit must be a numeric"),
    validateInputs
], getChatMessages)

chatRouter.get("/getAll", [
    userValidateMiddleware
], getAllChat)


export default chatRouter