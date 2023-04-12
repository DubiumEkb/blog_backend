import { Request, Response } from "express"

import { Tags } from "../../repositories/tags"
import { ITags } from "./tags.types"

// GET Tag list
export const getAllTags = async (request: Request, response: Response) => {
	try {
		// поиск тегов с использованием skip и limit
		const tagsQuery: ITags[] = await Tags.find({ status: true })

		// проверка, что тэг активный
		const tagsCount = await Tags.countDocuments({ status: true })

		// получаем список тэгов и количество их с статусом true
		const [tags, count] = await Promise.all([tagsQuery, tagsCount])

		// проверяем на пустое количество тэгов
		if (tags.length === 0) {
			return response.status(404).json({ success: false, message: "Список тэгов пуст" })
		}

		// успешный ответ
		response.status(200).json({ success: true, data: tags, count })
	} catch (error) {
		response.status(500).json({ success: false, message: "Ошибка при получении списка тэгов" })
	}
}

// GET Tags
export const getTags = async (request: Request, response: Response) => {
	try {
		// ограничение количества возвращаемых тегов, по умолчанию 10
		const limit = Number(request.query._limit) ?? 10

		// запрашиваемая страница, по умолчанию 1
		const page = Number(request.query._page) ?? 1

		// определение количества тегов, которые нужно пропустить
		const skip = (page - 1) * limit

		// поиск тегов с использованием skip и limit
		const tagsQuery: ITags[] = await Tags.find({ status: true }).skip(skip).limit(limit)

		// проверка, что тэг активный
		const tagsCount = await Tags.countDocuments({ status: true })

		// получаем список тэгов и количество их с статусом true
		const [tags, count] = await Promise.all([tagsQuery, tagsCount])

		// проверяем на пустое количество тэгов
		if (tags.length === 0) {
			return response.status(404).json({ success: false, message: "Список тэгов пуст" })
		}

		// успешный ответ
		response.status(200).json({ success: true, data: tags, count })
	} catch (error) {
		response.status(500).json({ success: false, message: "Ошибка при получении списка тэгов" })
	}
}

// POST Created Tag
export const postCreateTag = async (request: Request, response: Response) => {
	try {
		const { name, url, status } = request.body

		// Проверяем, что тег с таким name или url не существует
		const existingTag = await Tags.findOne({ $or: [{ name }, { url }] })
		if (existingTag) {
			return response.status(400).json({ success: false, message: "Тег с таким именем или URL уже существует" })
		}

		// Создаем новый тег
		const newTag = new Tags({ name, url, status })
		await newTag.save()

		// Отправляем успешный ответ с созданным тегом
		response.status(201).json({ success: true, tag: newTag })
	} catch (error) {
		response.status(500).json({ success: false, message: "Серверная ошибка" })
	}
}

// PATCH Edit Tag
export const patchEditTag = async (request: Request, response: Response) => {
	try {
		const { name, url, status } = request.body
		const tagId = request.params.id

		// Проверяем, что тег с указанным id существует
		const existingTag = await Tags.findById(tagId)
		if (!existingTag) {
			return response.status(404).json({ success: false, message: "Тег с указанным ID не найден" })
		}

		// Обновляем свойства тега
		existingTag.name = name ?? existingTag.name
		existingTag.url = url ?? existingTag.url
		existingTag.status = status ?? existingTag.status

		// Сохраняем изменения
		await existingTag.save()

		// Отправляем успешный ответ с обновленным тегом
		response.status(200).json({ success: true, tag: existingTag })
	} catch (error) {
		response.status(500).json({ success: false, message: "Серверная ошибка" })
	}
}
