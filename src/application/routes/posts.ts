import { Router } from "express"

import { createPosts, getAllPosts } from "../../domain/models/posts/posts"
import { checkAuth } from "../services/authCheck"

export const Posts: Router = Router()

Posts.get("/", getAllPosts)

Posts.post("/", checkAuth, createPosts)
