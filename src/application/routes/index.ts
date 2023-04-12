import { Router } from "express"

import { Auth } from "./auth"
import { Posts } from "./posts"
import { Tags } from "./tags"
import { Token } from "./token"
import { User } from "./user"

export const Routes: Router = Router()

// Работа с API /posts
Routes.use("/posts", Posts)

// Работа с API /registration
Routes.use("/auth", Auth)

// Работа с API /me
Routes.use("/me", User)

// Работа с API /token
Routes.use("/token", Token)

// Работа с API /tags
Routes.use("/tags", Tags)

// Работа с API /categories
// Routes.use("/categories", categories)
