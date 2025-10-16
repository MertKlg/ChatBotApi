import { Router } from "express";
import { userValidateMiddleware } from "../middleware/user-validate";
import { createChat, getAllChat, getChatMessages } from "../controller/chat-controller";
import { body, param, query } from "express-validator";
import { validateInputs } from "../middleware/validate-inputs";

const chatRouter = Router()

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

chatRouter.get("/get", [
    userValidateMiddleware
], getAllChat)

chatRouter.post("/create", [
    userValidateMiddleware,
    body("title")
        .escape()
        .trim()
        .notEmpty()
        .withMessage("Chat title is not empty"),
    validateInputs
], createChat)


export default chatRouter