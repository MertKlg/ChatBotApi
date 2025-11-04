import { param } from "express-validator";
import { transaction } from "../../../common/types";
import postgreDb from "../../postgre-db";
import { GetChatMessageQuery } from "../chat/chat-interface";
import { FindAiModelParams, FindAIByChatId, IAi, InsertAiMessageQuery } from "./ai-interface";

export const getAll = (transaction: transaction): Promise<IAi[]> => {
    return postgreDb.query<IAi>('select id, model_name, provider, is_active, model_identifier from ai_models ', [], undefined, transaction)
}

export const findByParams = (params: FindAiModelParams, transaction: transaction): Promise<IAi[]> => {
    return postgreDb.query<IAi>('select id,model_identifier from ai_models where id = $1', [params.id], undefined, transaction)
}

export const findByChatId = (params: FindAiModelParams, transaction: transaction): Promise<FindAIByChatId[]> => {
    return postgreDb.query<IAi>('select ai.model_identifier, ai.provider, ai.id from chat_participants cp join ai_models ai on ai.id = cp.participants_id where cp.chat_id = $1', [params.id], undefined, transaction)
}
