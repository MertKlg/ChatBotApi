import { GoogleGenAI } from "@google/genai";
import { AskAiQuery, AskAiResponse } from "../model/ai/ai-interface";
import { AiClients } from "./interface/client-interface";


export class GeminiClient implements AiClients {
    private googleGenAi: GoogleGenAI | null = null

    constructor() {
        if (!this.googleGenAi) {
            this.googleGenAi = new GoogleGenAI({
                apiKey: `${process.env.GEMINI_KEY}`
            })
        }
    }

    async askAiModel(param: AskAiQuery): Promise<AskAiResponse | undefined> {
        if (!this.googleGenAi) {
            throw new Error("Google ai not implemented")
        }

        const result = await this.googleGenAi.models.generateContent({
            model: param.model_identifier,
            contents: param.content
        })

        const text = result.text
        if (text !== undefined) {
            return {
                content: text,
                ai_model_id: param.ai_model_id,
                chat_id: param.chat_id
            }
        }

        return undefined
    }
}