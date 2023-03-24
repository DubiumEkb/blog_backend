import { Router } from "express"

import { Posts } from "./posts"

export const Routes: Router = Router()

Routes.use("/posts", Posts)
