import { map } from "zod";
import { ErrorMessages } from "../common/messages";
import { PostgreDatabase } from "../database";
import { IAllChatDto, IChat, IChatParticipants, IMessageDto } from "../model/chat/chat-interface";
import { createChat, createMembers, createMessage, getAllChats, getChat, getMembers } from "../model/chat/chat-model";
import { IResult } from "../model/response/response-interface";

let db = PostgreDatabase.getInstance()
export const createChatService = async (userId: string, title: string): Promise<IResult<string>> => {
    return db.transaction(async (e) => {
        const getChat = await createChat({ title: title, type: 'ai_single' }, e)
        const chatId = getChat?.id
        if (!chatId)
            throw new Error("Chat not founded")

        await createMembers({ chat_id: chatId, user_id: userId, role: "owner" }, e)

        return { data: ErrorMessages.SERVER.SUCCESS }
    })
}

export const getChatService = async (userId: string): Promise<IResult<(IChat | undefined)[]>> => {
    return db.transaction(async (e) => {
        const findMembers = await getMembers(userId, e)
        if (!findMembers)
            throw new Error("No members founded")

        const res = await Promise.all(findMembers.map(data => getChat(data.user_id, e)))

        return { data: res }
    })
}

export const getAllChatsService = async (userId: string): Promise<IResult<Record<string, IChat[]>>> => {
    return db.transaction(async (e) => {
        // First of all, which user joined chats ?
        const chats = await getAllChats(userId, e)
        var mapping: Record<string, IChat[]> = {}
        if (!chats || chats.length < 0)
            throw new Error("Chat not found")

        mapping["chats"] = chats
        return { data: mapping }
    })
}

export const createMessageService = async (messageDto: IMessageDto): Promise<IResult<string>> => {
    return db.transaction(async (e) => {
        await createMessage(messageDto, e)
        return { data: "Success" }
    })
}