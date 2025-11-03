import { AskAiQuery, AskAiResponse } from "../../model/ai/ai-interface";


export interface AiClients {
    askAiModel(param: AskAiQuery): Promise<AskAiResponse | undefined>
}