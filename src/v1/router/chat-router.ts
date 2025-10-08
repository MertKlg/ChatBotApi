import { Router } from "express";
import { userValidateMiddleware } from "../middleware/user-validate";
import { createChat, getAllChat, getChat } from "../controller/chat-controller";
import { body, param, query } from "express-validator";
import { validateInputs } from "../middleware/validate-inputs";

const chatRouter = Router()

chatRouter.get("/chat/{chatId}/message/page=1&limit=50", [
    userValidateMiddleware,
    query("chatId")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Chat id is not to be empty"),
    validateInputs
], getChat)

chatRouter.get("/get",[
    userValidateMiddleware
],getAllChat)

chatRouter.post("/create", [
    userValidateMiddleware,
    body("title")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Chat title is not empty"),
    validateInputs
], createChat )


export default chatRouter