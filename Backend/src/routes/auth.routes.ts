import { Router } from "express";
import { authLogIn, authLogOut, authSignUp } from "../controller/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../enum/enums";

export const authRouter = Router()

authRouter.post("/auth/login", authLogIn)
authRouter.post("/auth/signup", authSignUp)
authRouter.get("/auth/logout", authenticate, authorize(...Object.values(ROLES)), authLogOut)