import { Router } from "express"

import { checkToken } from "../../domain/models/token/check"

export const Token: Router = Router()

Token.post("/check", checkToken)
