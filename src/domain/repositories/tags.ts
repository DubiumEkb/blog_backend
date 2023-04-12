import { Schema, model } from "mongoose"

import { ITags } from "../models/tags/tags.types"

const tagsSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		url: { type: String, required: true, unique: true },
		status: { type: Boolean, default: false },
	},
	{ timestamps: true },
)

export const Tags = model<ITags>("Tags", tagsSchema)
