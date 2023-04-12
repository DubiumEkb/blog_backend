import { Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import { generateAccessToken, generateRefreshToken } from "../../../application/services/tokenRepository"
import config from "../../../config"
import { RefreshToken } from "../../repositories/token"

export const checkToken = async (request: Request, response: Response) => {
	try {
		const { authorization } = request.headers
		const { refreshToken } = request.body
		const jwtSecret = config.jwt

		if (!authorization) {
			return response.status(401).json({ success: false, message: "Отсутствует токен доступа" })
		}

		if (!refreshToken) {
			return response.status(401).json({ success: false, message: "Отсутствует токен обновления" })
		}

		if (!jwtSecret) {
			return response.status(401).json({ success: false, message: "Отсутствует секретный токен" })
		}

		const token = authorization.replace("Bearer ", "")
		const decodedAccessToken = jwt.decode(token) as JwtPayload

		if (!decodedAccessToken || !decodedAccessToken._id || !decodedAccessToken.exp) {
			return response.status(401).json({ success: false, message: "Недействительный токен доступа" })
		}

		const { _id } = decodedAccessToken

		const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken, userId: _id })

		if (!refreshTokenDoc) {
			return response.status(401).json({ success: false, message: "Токен обновления недействителен" })
		}

		if (decodedAccessToken.exp < Date.now() / 1000) {
			const newAccessToken = generateAccessToken(_id)
			const newRefreshToken = generateRefreshToken(_id)

			// Обновляем access токен в заголовке ответа
			response.setHeader("Authorization", `Bearer ${newAccessToken}`)

			// Обновляем refresh токен в базе данных
			refreshTokenDoc.token = newRefreshToken
			refreshTokenDoc.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			await refreshTokenDoc.save()

			// Возвращаем обновленный refresh токен в теле ответа
			return response.status(200).json({ success: true, refreshToken: newRefreshToken })
		}

		if (refreshTokenDoc.expires < new Date()) {
			const newAccessToken = generateAccessToken(_id)
			const newRefreshToken = generateRefreshToken(_id)

			refreshTokenDoc.token = newRefreshToken
			refreshTokenDoc.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			await refreshTokenDoc.save()

			response.setHeader("Authorization", `Bearer ${newAccessToken}`)

			return response.status(201).json({ success: true, refreshToken: newRefreshToken })
		}

		return response.status(200).json({ success: true })
	} catch (error) {
		return response.status(500).json({ success: false, message: "Внутренняя ошибка сервера" })
	}
}
