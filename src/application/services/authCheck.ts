import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import config from "../../config"

export interface DecodedToken extends JwtPayload {
	_id: string
}

export const checkAuth = (request: Request, response: Response, next: NextFunction) => {
	// Проверяем наличие jwt токена
	if (!config.jwt) {
		return response.status(500).json({ success: false, message: "Секрет JWT не найден в конфигурации" })
	}

	// Извлекаем токен из заголовка авторизации
	const token = (request.headers.authorization || "").replace(/Bearer\s?/, "")

	// Если токен не передан, возвращаем ошибку
	if (!token) {
		return response.status(401).json({ success: false, message: "Необходимо предоставить токен." })
	}

	try {
		// Проверяем токен и извлекаем из него данные
		const decoded = jwt.verify(token, config.jwt, { algorithms: ["HS256"] }) as DecodedToken

		// Добавляем данные пользователя в запрос
		response.locals.userId = decoded._id

		next()
	} catch (error) {
		return response.status(401).json({ success: false, message: "Неверный токен." })
	}
}
