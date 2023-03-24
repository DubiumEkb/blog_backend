import { Router } from "express"

import { createPosts, getAllPosts } from "../../domain/models/posts/posts"

export const Posts: Router = Router()

Posts.get("/", getAllPosts)

Posts.post("/", createPosts)
