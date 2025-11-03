export interface IChat {
    id: string,
    title: string,
    type: string,
    created_at: Date,
    updated_at: Date
}

export interface IAllChat extends IChat {
    role: string,
    owner: string
}

export type IAllChatDto = Omit<IAllChat, ''>
export type CreateChat = Omit<IChat, 'id' | 'created_at' | 'updated_at' | 'type'>
export type GetChat = Omit<IChat, 'title' | 'type' | 'created_at' | 'updated_at'>

export interface IChatMessageDto {
    chatId: string,
    limit: number,
    page: number
}

export type IChatMessage = Partial<IChatMessageDto>

/*
Chat Participants
*/
export interface IChatParticipants {
    chat_id: string,
    participants_id: string,
    role: 'member' | 'owner',
    type: 'user' | 'ai_model'
}

export interface QueryParticipantsDetails {
    userId: string,
    chatId: string
}

export interface ResultParticipantsDetails {
    participants_id: string,
    role: string,
    participant_name: string
}

export interface DtoParticipantsDetails {
    chatId: string
}


/* MESSAGES */
export interface GetChatMessageQueryResult {
    message_id: string,
    content: string,
    is_from_ai: boolean,
    created_at: Date,
    sender_id: string | null,
    sender_name: string
}

export interface GetChatMessageQuery {
    chat_id: string,
    user_id: string
}

export interface CreateChatMessageQuery {
    chat_id: string,
    content: string,
    is_from_ai: boolean,
    ai_model_id: string | null,
    sender_id: string | null,
}


export interface ChatMessageDTO {
    chat_id: string,
    content: string,
    sender_id: string
}