import { PoolClient } from "pg"
import { PostgreDatabase } from "../../database"
import { CreateChat, IAllChat, IChat, IChatMessage, IChatParticipants, IMessage, IMessageDto } from "./chat-interface"
import { transaction } from "../../common/types"
import { IAi } from "../ai/ai-interface"

let db = PostgreDatabase.getInstance()
export const createChat = async (chat: CreateChat, transaction: transaction): Promise<IChat | undefined> => {
    return (await db.query<IChat>('insert into chats (title) values($1) RETURNING id', [chat.title], undefined, transaction))[0]
}

export const getChat = async (chatId: string, transaction: transaction): Promise<IChat | undefined> => {
    return (await db.query<IChat>('select id, title, type, created_at, updated_at from chats where id = $1', [chatId], undefined, transaction))[0]
}

export const getAllChats = async (userId: string, transaction: transaction): Promise<IAllChat[] | undefined> => {
    return await db.query<IAllChat>('select chats.id, chats.title, users.email as owner, cp.role from chats join chat_participants cp on chats.id = cp.chat_id join users on users.id = cp.participants_id where cp.participants_id = $1', [userId], undefined, transaction)
}

/* Chat participants */
export const createMembers = async (member: IChatParticipants, transaction: transaction) => {
    await db.query("insert into chat_participants (chat_id, participants_id, role, type) values ($1,$2,$3,$4)", [member.chat_id, member.participants_id, member.role, member.type], undefined, transaction)
}

export const getMembers = async (userId: string, transaction: transaction): Promise<IChatParticipants[] | undefined> => {
    return await db.query("select chat_id, role from chat_participants where user_id = $1", [userId], undefined, transaction)
}

/* MESSAGES */
export const getChatMessage = async (chatId: string, transaction: transaction): Promise<IMessage[] | undefined> => {
    return await db.query<IMessage>("select * from messages where chat_id = $1", [chatId], undefined, transaction)
}
export const createMessage = async (dto: IMessageDto, transaction: transaction): Promise<void> => {
    await db.query("insert into messages (chat_id, sender_id, content) values ($1,$2,$3)", [dto.chat_id, dto.sender_id, dto.content], undefined, transaction)
}
