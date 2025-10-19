import { ErrorMessages } from "../common/messages";
import { PostgreDatabase } from "../database";
import { IAiDTO } from "../model/ai/ai-interface";
import { IChat, IChatMessageDto, IChatParticipants, IMessageDto } from "../model/chat/chat-interface";
import { createChat, createMembers, createMessage, getAllChats, getChat, getMembers } from "../model/chat/chat-model";
import { IResult } from "../model/response/response-interface";

let db = PostgreDatabase.getInstance()
export const createChatService = async (userId: string, title: string, iAiDto: IAiDTO[]): Promise<IResult<string>> => {
    return db.transaction(async (e) => {
        console.log("Create starting")
        const getChat = await createChat({ title: title }, e)
        const chatId = getChat?.id
        if (!chatId)
            throw new Error("Chat not founded")

        console.log("Create chat finished")
        console.log("Starting create members")
        const members: IChatParticipants[] = []

        iAiDto.forEach((e) => {
            members.push({ chat_id: getChat.id, participants_id: e.id, role: 'member', type: 'ai_model' })
        })
        members.push({ chat_id: getChat.id, participants_id: userId, role: 'owner', type: 'user' })

        const memberCreationStat = members.map(item => createMembers(item, e))

        await Promise.all(memberCreationStat)
        console.log("Ending.. create members")

        console.log("Create ending")
        return { data: ErrorMessages.SERVER.SUCCESS }
    })
}

export const getChatService = async (userId: string): Promise<IResult<(IChat | undefined)[]>> => {
    return db.transaction(async (e) => {
        const findMembers = await getMembers(userId, e)
        if (!findMembers)
            throw new Error("No members founded")

        const res = await Promise.all(findMembers.map(data => getChat(data.participants_id, e)))

        return { data: res }
    })
}

export const getAllChatsService = async (userId: string): Promise<IResult<Record<string, IChat[]>>> => {
    return db.transaction(async (e) => {
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

export const getChatMessages = async (dto: IChatMessageDto) => {

} 