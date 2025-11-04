export interface IAi {
    id: string,
    model_name: string,
    provider: string,
    is_active: boolean,
    model_identifier: string
}


export interface FindAIByChatId {
    model_identifier: string,
    provider: string,
    id: string
}

export type IAiDTO = Omit<IAi, 'model_name' | 'provider' | 'is_active' | 'model_identifier'>

export type FindAiModelParams = Partial<Omit<IAi, 'model_name' | 'provider' | 'is_active' | 'model_identifier'>>

export interface InsertAiMessageQuery {
    chat_id: string,
    is_from_ai: true,
    ai_model_id: string,
    content: string
}

export interface AskAiQuery {
    provider: string,
    ai_model_id: string,
    content: string,
    model_identifier: string,
    chat_id: string
}

export interface AskAiResponse {
    chat_id: string,
    ai_model_id: string,
    content: string
}