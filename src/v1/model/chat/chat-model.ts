import { PostgreDatabase } from "../../database"
import { CreateChat, IAllChat, IChat, IChatParticipants, QueryParticipantsDetails, ResultParticipantsDetails, CreateChatMessageQuery, GetChatMessageQueryResult, GetChatMessageQuery } from "./chat-interface"
import { transaction } from "../../common/types"

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

export const queryParticipantsDetails = async (query: QueryParticipantsDetails, transaction: transaction): Promise<ResultParticipantsDetails[] | undefined> => {
    return await db.query<ResultParticipantsDetails>("SELECT cp.participants_id, cp.role, COALESCE(u.email, aim.model_name) AS participant_name FROM chat_participants AS cp LEFT JOIN users AS u ON cp.participants_id::text = u.id::text AND cp.type = 'user' LEFT JOIN ai_models AS aim ON cp.participants_id::text = aim.id::text AND cp.type = 'ai_model' WHERE cp.chat_id = $1 and exists (select 1 FROM chat_participants AS cp_auth where cp_auth.chat_id = $2 and cp_auth.participants_id = $3)", [query.chatId, query.chatId, query.userId], undefined, transaction)
}

/* MESSAGES */
export const getChatMessage = async (query: GetChatMessageQuery, transaction: transaction): Promise<GetChatMessageQueryResult[] | undefined> => {
    return await db.query<GetChatMessageQueryResult>("SELECT m.id AS message_id, m.content, m.is_from_ai, m.created_at, CASE WHEN m.is_from_ai = false THEN m.sender_id::text WHEN m.is_from_ai = true THEN m.ai_model_id::text ELSE NULL END AS sender_id, COALESCE(u.email, aim.model_name) AS sender_name FROM messages AS m LEFT JOIN users AS u ON m.sender_id::text = u.id::text AND m.is_from_ai = false LEFT JOIN ai_models AS aim ON m.ai_model_id::text = aim.id::text AND m.is_from_ai = true WHERE m.chat_id = $1 AND EXISTS ( SELECT 1 FROM chat_participants AS cp_auth WHERE cp_auth.chat_id = $2 AND cp_auth.participants_id = $3 ) ORDER BY m.created_at ASC;", [query.chat_id, query.chat_id, query.user_id], undefined, transaction)
}
export const createMessage = async (dto: CreateChatMessageQuery, transaction: transaction): Promise<void> => {
    await db.query("insert into messages (chat_id, sender_id, content) values ($1,$2,$3)", [dto.chat_id, dto.sender_id, dto.content], undefined, transaction)
}
