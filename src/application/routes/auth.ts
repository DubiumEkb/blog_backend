import { Router } from "express"

import { deleteLogout, postCreatePassword, postCreateUser, postLogin, postLogout } from "../../domain/models/auth/auth"

export const Auth: Router = Router()

Auth.post("/registration", postCreateUser)
Auth.post("/password", postCreatePassword)
Auth.post("/login", postLogin)
Auth.post("/logout", postLogout)
Auth.delete("/logout", deleteLogout)
