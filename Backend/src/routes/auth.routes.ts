import { Router } from "express";
import { authLogIn, authLogOut, authSignUp } from "../controller/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../enum/enums";

export const authRouter = Router()

authRouter.post("/login", authLogIn)
authRouter.post("/signup", authSignUp)
authRouter.get("/logout", authenticate, authorize(...Object.values(ROLES)), authLogOut)