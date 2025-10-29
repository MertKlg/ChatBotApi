import { GoogleGenAI } from "@google/genai"
import { IResult } from "../model/response/response-interface"
import { AskAiQuery, AskAiResponses } from "../model/ai/ai-interface"
const googleAi = new GoogleGenAI({
    apiKey: `${process.env.GEMINI_KEY}`
})

export const askAiModels = async (param: AskAiQuery): Promise<IResult<AskAiResponses>> => {
    let data: AskAiResponses | undefined
    var error: Error | undefined = undefined

    switch (param.provider) {
        case "google":
            try {
                const res = await googleAi.models.generateContent({
                    model: param.model_identifier,
                    contents: param.content
                })

                const text = res.text

                console.log(text)

                if (text !== undefined) {
                    data = {
                        content: text,
                        ai_model_id: param.ai_model_id,
                        chat_id: param.chat_id
                    } as AskAiResponses
                } else {
                    error = new Error("Something went wrong on ai model")
                }
            } catch (error: any) {
                error = error instanceof Error ? error : new Error(error.message ?? "Something went wrong")
            }
            break;

        default:
            error = new Error("Something went wrong");
    }

    return {
        data: data,
        error: error
    }
}