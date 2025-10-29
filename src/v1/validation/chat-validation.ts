import { body } from "express-validator";
import * as z from "zod";
import { findByParams } from "../model/ai/ai-model";


export const validateChatMessage = z.object({
    chat_id: z.string().trim(),
    content: z.string().trim()
})

export const CreateChatValidation = () => {
    return [
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
            })
    ]
}