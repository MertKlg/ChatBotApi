import { Router } from "express";
import { userValidateMiddleware } from "../middleware/user-validate";
import { getProfile } from "../controller/profile-controller";


const profileRouter = Router()

profileRouter.get("/get", [userValidateMiddleware], getProfile)

export default profileRouter