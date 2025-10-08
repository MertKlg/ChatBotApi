import * as z from "zod";


export const validateChatMessage = z.object({
    chat_id : z.string().trim(),
    content : z.string().trim(),
    type : z.string().trim()
})