import { Schema, model } from "mongoose"

import { ITags } from "../models/tags/tags.types"

const tagsSchema = new Schema({
	name: { type: String, required: true },
	url: { type: String, required: true },
})

export const Tags = model<ITags>("Tags", tagsSchema)
