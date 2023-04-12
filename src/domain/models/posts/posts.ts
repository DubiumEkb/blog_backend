import { Request, Response } from "express"
import slugify from "slugify"

import { Posts } from "../../repositories/posts"

// Get All Posts
export const getAllPosts = async (request: Request, response: Response) => {
	try {
		// ограничение количества возвращаемых постов, по умолчанию 10
		const limit = Number(request.query._limit) ?? 10

		// запрашиваемая страница, по умолчанию 1
		const page = Number(request.query._page) ?? 1

		// определение количества постов, которые нужно пропустить
		const skip = limit * (page - 1)

		// поиск постов с использованием skip и limit
		const postsQuery = Posts.find({ status: true }).skip(skip).limit(limit)

		// проверка, что пост активный
		const postsCount = Posts.countDocuments({ status: true })

		// получаем список постов и количество их с статусом true
		const [posts, count] = await Promise.all([postsQuery, postsCount])

		// проверяем на пустое количество постов
		if (posts.length === 0) {
			return response.status(200).status(404).json({ success: false, message: "Список постов пуст" })
		}

		// успешный ответ
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
			return response.status(400).json({ success: false, error: "Запрос не содержит данных" })
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
			return response.status(409).json({ success: false, error: "Статья с таким URL уже существует" })
		}

		post = await Posts.create(postData)

		response.status(201).json({ success: true, data: post })
	} catch (error) {
		response.status(500).json({ success: false, error: "Внутренняя ошибка сервера" })
	}
}
