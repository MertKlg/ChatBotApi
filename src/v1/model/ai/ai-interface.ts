export interface IAi {
    id: string,
    model_name: string,
    provider: string,
    is_active: boolean,
    model_identifier: string
}


export type IAiDTO = Omit<IAi, 'model_name' | 'provider' | 'is_active' | 'model_identifier'>

export type FindAiModelParams = Partial<Omit<IAi, 'model_name' | 'provider' | 'is_active' | 'model_identifier'>>
