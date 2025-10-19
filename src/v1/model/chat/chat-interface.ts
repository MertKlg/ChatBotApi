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

/* CHAT MESSAGES */
export interface IMessage {
    id: string,
    chat_id: string,
    sender_id: string,
    is_from_ai: boolean,
    ai_model_id: string,
    content: string,
    created_at: Date,
    type: string
}

export type IMessageDto = Partial<Omit<IMessage, 'id' | 'is_from_ai' | 'ai_model_id' | 'created_at'>>