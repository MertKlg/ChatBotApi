import { AskAiQuery, AskAiResponse } from "../../db/model/ai/ai-interface";


export interface AiClients {
    askAiModel(param: AskAiQuery): Promise<AskAiResponse | undefined>
}