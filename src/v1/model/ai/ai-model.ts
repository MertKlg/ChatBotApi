import { transaction } from "../../common/types";
import { PostgreDatabase } from "../../database";
import { FindAiModelParams, IAi } from "./ai-interface";

let db = PostgreDatabase.getInstance()

export const getAiModels = (transaction: transaction): Promise<IAi[]> => {
    return db.query<IAi>('select id, model_name, provider, is_active, model_identifier from ai_models ', [], undefined, transaction)
}

export const findAiModel = (params: FindAiModelParams, transaction: transaction): Promise<IAi[]> => {
    return db.query<IAi>('select id,model_identifier from ai_models where id = $1', [params.id], undefined, transaction)
}