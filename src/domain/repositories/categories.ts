import { Schema, model } from "mongoose"
import slugify from "slugify"

import { ICategories } from "../models/categories/categories.types"

const categoriesSchema = new Schema(
	{
		// Название категории
		name: { type: String, required: true, unique: true },

		// URL категории
		url: { type: String, required: true, unique: true },

		// Описание категории
		description: { type: String, required: true },
	},
	{ timestamps: true },
)

categoriesSchema.pre("save", function (this: ICategories, next: () => void) {
	if (!this.url) {
		this.url = slugify(this.name, { lower: true, strict: true })
	}
	next()
})

export const Category = model<ICategories>("Category", categoriesSchema)
