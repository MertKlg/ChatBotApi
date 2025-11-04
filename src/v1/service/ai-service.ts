import { IResult } from "../db/model/response/response-interface"
import { AskAiQuery, AskAiResponse } from "../db/model/ai/ai-interface"
import { GeminiClient } from "../clients/gemini-client"
import { GetChatMessageQueryResult } from "../db/model/chat/chat-interface"
import { insertMessageService, insertMessageWithReturningService } from "./chat-service"


export const askAiModels = async (param: AskAiQuery): Promise<IResult<GetChatMessageQueryResult>> => {
    switch (param.provider) {
        case "google":
            try {
                const client = new GeminiClient()
                const result = await client.askAiModel(param)
                // Result returned successfully
                if (result != undefined) {
                    const message = await insertMessageWithReturningService({ chat_id: result.chat_id, content: result.content, ai_model_id: result.ai_model_id, is_from_ai: true, sender_id: null })
                    return {
                        data: message.data,
                        error: message.error
                    }
                }
                return {
                    data: undefined
                }

            } catch (error: any) {
                return {
                    error: error instanceof Error ? error : new Error(error.message ?? "Something went wrong")
                }
            }
            break;

        default:
            return {
                error: new Error("No ai model founded")
            }
    }
}