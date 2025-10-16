import { PostgreDatabase } from "../database"
import { getAiModels } from "../model/ai/ai-model"


let db = PostgreDatabase.getInstance()
export const getAllAiModelsService = () => {
    return db.transaction(async (e) => {
        return {
            data: await getAiModels(e)
        }
    })
}