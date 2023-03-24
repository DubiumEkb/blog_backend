import { Schema, model } from "mongoose"

import { IPost } from "../models/posts/posts.types"

const postsSchema = new Schema(
	{
		// Статус поста, либо активен, либо нет
		status: { type: Boolean, required: true },

		// Название статьи
		title: { type: String, required: true },

		// Краткое описание статьи
		previewDescription: { type: Object, required: false },

		// Статья
		content: { type: Object, required: false },

		// Адрес статьи
		postUrl: { type: String, required: false, unique: true },

		// Картинка поста
		cover: {
			url: { type: String, required: true }, // Адрес картинки
			alt: { type: String, required: true }, // Описание картинки
		},

		// Перевод статьи или статья
		type: {
			name: { type: String, required: true }, // Название источника
			url: { type: String, required: true }, // Адрес источника
		},

		// Категория
		categories: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: false,
		},

		// Тэги статьи
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tags",
				required: false,
			},
		],

		// Тип карточки, false - Обычная, true - На всю ширину
		typeCard: { type: Boolean, required: true },

		// Автор поста
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
	},
	{ timestamps: true },
)

export const Posts = model<IPost>("Posts", postsSchema)
