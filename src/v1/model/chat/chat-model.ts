import { PoolClient } from "pg"
import { PostgreDatabase } from "../../database"
import { CreateChat, IAllChat, IChat, IChatParticipants, IMessage, IMessageDto } from "./chat-interface"
import { transaction } from "../../common/types"

let db = PostgreDatabase.getInstance()
export const createChat = async (chat : CreateChat, transaction : transaction): Promise<IChat | undefined> => {
    return (await db.query<IChat>('insert into chats (title, type) values($1,$2) RETURNING id', [chat.title, chat.type], undefined, transaction))[0]
}

export const getChat = async (chatId : string, transaction : transaction): Promise<IChat | undefined> => {
    return (await db.query<IChat>('select id, title, type, created_at, updated_at from chats where id = $1', [chatId], undefined, transaction))[0]
}

export const getAllChats = async (userId : string, transaction : transaction) : Promise<IAllChat[] | undefined> => {
    return await db.query<IAllChat>('select chats.id, chats.title, chats.type,chat_participants.role, users.email as owner,chats.updated_at ,chats.created_at from chat_participants inner join chats on chats.id = chat_participants.chat_id join users on users.id = chat_participants.user_id where chat_participants.user_id = $1',[userId], undefined, transaction)
}

export const getChatMessages = async (chatId : string, transaction : transaction) : Promise<undefined> => {

} 

/* Chat participants */
export const createMembers = async(member : IChatParticipants, transaction : transaction) => {
    await db.query("insert into chat_participants (chat_id, user_id, role) values ($1,$2,$3)", [member.chat_id,member.user_id,member.role], undefined, transaction)
}

export const getMembers = async(userId : string, transaction : transaction): Promise<IChatParticipants[] | undefined> => {
    return await db.query("select chat_id, role from chat_participants where user_id = $1", [userId], undefined, transaction)
}

/* MESSAGES */
export const getChatMessage = async(chatId : string, transaction : transaction) : Promise<IMessage[] | undefined> => {
    return await db.query<IMessage>("select * from messages where chat_id = $1",[chatId], undefined, transaction )
}
export const createMessage = async (dto : IMessageDto, transaction : transaction) : Promise<void> => {
    await db.query("insert into messages (chat_id, sender_id, content) values ($1,$2,$3)", [dto.chat_id, dto.sender_id, dto.content], undefined, transaction)
}
