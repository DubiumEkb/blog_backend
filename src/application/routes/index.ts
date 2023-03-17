import { Request, Response, Router } from "express"

import Posts from "../../domain/models/Posts"

export const Routes: Router = Router()

Routes.get("/posts", Posts.GET)
