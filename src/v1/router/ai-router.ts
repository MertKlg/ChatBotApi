import { Router } from "express";
import { userValidateMiddleware } from "../middleware/user-validate";
import { getAiModelsController } from "../controller/ai-controller";


const AiRouter = Router()

AiRouter.get("/getAll", [userValidateMiddleware], getAiModelsController)

export default AiRouter