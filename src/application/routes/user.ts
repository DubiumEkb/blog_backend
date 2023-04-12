import { Router } from "express"

import { getUser } from "../../domain/models/user/user"
import { checkAuth } from "../services/authCheck"

export const User: Router = Router()

User.get("/", checkAuth, getUser)
