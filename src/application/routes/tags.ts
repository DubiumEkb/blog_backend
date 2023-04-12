import { Router } from "express"

import { getAllTags, getTags, patchEditTag, postCreateTag } from "../../domain/models/tags/tags"
import { checkAuth } from "../services/authCheck"

export const Tags: Router = Router()

Tags.get("/", getTags)

Tags.post("/", checkAuth, postCreateTag)

Tags.patch("/:id", checkAuth, patchEditTag)

// Tags.get("/:id", getTag)

Tags.get("/list", getAllTags)
