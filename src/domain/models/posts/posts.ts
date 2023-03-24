import { Request, Response } from "express"

import { Posts } from "../../repositories/posts"

const slugify = require("slugify")

// Get All Posts
export const getAllPosts = async (request: Request, response: Response) => {
	try {
		const limit = Number(request.query._limit) ?? 10
		const page = Number(request.query._page) ?? 1
		const skip = limit * (page - 1)

		const postsQuery = Posts.find({ status: true }).skip(skip).limit(limit)
		const postsCount = Posts.countDocuments({ status: true })

		const [posts, count] = await Promise.all([postsQuery, postsCount])

		response.json({ success: true, data: posts, count })
	} catch (error) {
		response.status(500).json({ success: false, error: "Внутренняя ошибка сервера" })
	}
}

// Create Posts
export const createPosts = async (request: Request, response: Response) => {
	try {
		const { status, title, postUrl, previewDescription, type, tags, typeCard, cover, author } = request.body

		if (Object.keys(request.body).length === 0) {
			response.status(400).json({ success: false, error: "Запрос не содержит данных" })
			return
		}

		const postData = {
			status,
			title,
			postUrl: postUrl ?? slugify(title, { lower: true, strict: true }),
			previewDescription,
			type,
			tags,
			typeCard,
			cover,
			author: author,
		}

		// Проверяем, есть ли статья с таким postUrl
		let post = await Posts.findOne({ postUrl: postUrl })
		if (post) {
			response.status(409).json({ success: false, error: "Статья с таким URL уже существует" })
			return
		}

		post = await Posts.create(postData)

		response.status(201).json({ success: true, data: post })
	} catch (error) {
		response.status(500).json({ success: false, error: "Внутренняя ошибка сервера" })
	}
}
