import bcrypt from "bcrypt"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"

import { generateAccessToken, generateRefreshToken } from "../../../application/services/tokenRepository"
import config from "../../../config"
import { Password } from "../../repositories/password"
import { RefreshToken } from "../../repositories/token"
import { User } from "../../repositories/user"
import { DecodedToken } from "../token/check.types"
import { ILogin, IPassword, IUser } from "./auth.types"

// Регистрация пользователя
export const postCreateUser = async (request: Request, response: Response) => {
	try {
		const { name, login, email }: IUser = request.body

		const existingEmailUser = await User.findOne({ email })
		if (existingEmailUser) {
			return response.status(409).json({ success: false, message: "Пользователь с таким логином уже существует" })
		}

		const existingLoginUser = await User.findOne({ login })
		if (existingLoginUser) {
			return response.status(409).json({ success: false, message: "Пользователь с таким логином уже существует" })
		}

		const newUser = new User({
			name,
			login,
			email,
		})

		await newUser.save()

		const accessToken = generateAccessToken(newUser._id.toString())
		const refreshToken = generateRefreshToken(newUser._id.toString())

		const newRefreshToken = new RefreshToken({
			token: refreshToken,
			userId: newUser._id,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
		})
		await newRefreshToken.save()

		response
			.status(201)
			.header("Authorization", "Bearer " + accessToken)
			.json({ success: true, data: newUser, token: refreshToken })
	} catch (error) {
		console.error(error)
		response.status(500).json({ success: false, message: "Error creating user" })
	}
}

// Регистрация пользователя - пароль
export const postCreatePassword = async (request: Request, response: Response) => {
	try {
		const { user, password }: IPassword = request.body

		const hashedPassword = await bcrypt.hash(password, 10)

		const newPassword = new Password({
			user,
			password: hashedPassword,
		})

		await newPassword.save()

		response.status(201).json({ success: true, data: newPassword })
	} catch (error) {
		console.error(error)
		response.status(500).json({ success: false, message: "Ошибка при создании пароля" })
	}
}

// Авторизация
export const postLogin = async (request: Request, response: Response) => {
	const { login, password }: ILogin = request.body

	// Проверяем, что пользователь ввел логин или email и пароль
	if (!login || !password) {
		return response.status(400).json({ success: false, message: "Не указан логин или email или пароль" })
	}

	try {
		// Ищем пользователя по логину или email
		const user = await User.findOne({ $or: [{ login }, { email: login }] })

		// Если пользователь не найден
		if (!user) {
			return response.status(401).json({ success: false, message: "Пользователь не найден" })
		}

		// Получаем объект Password для данного пользователя
		const userPassword = await Password.findOne({ user: user._id })

		if (!userPassword) {
			return response.status(401).json({ success: false, message: "Неверный пароль" })
		}

		// Проверяем, что пароль верный
		const isPasswordValid = await bcrypt.compare(password, userPassword.password)

		if (!isPasswordValid) {
			return response.status(401).json({ success: false, message: "Неверный пароль" })
		}

		// Генерируем токены и сохраняем их в базе данных
		const accessToken = generateAccessToken(user._id.toString())
		const refreshToken = generateRefreshToken(user._id.toString())

		const newRefreshToken = new RefreshToken({
			token: refreshToken,
			userId: user._id,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
		})
		await newRefreshToken.save()

		// Отправляем токены в заголовках ответа
		response
			.status(200)
			.header("Authorization", `Bearer ${accessToken}`)
			.json({ success: true, token: refreshToken })
	} catch (error) {
		console.error(error)
		response.status(500).json({ success: false, message: "Ошибка авторизации" })
	}
}

// Закрытие других сессий
export const deleteLogout = async (request: Request, response: Response) => {
	const { token } = request.body

	if (!token) {
		return response.status(400).json({ success: false, message: "Токен не был предоставлен" })
	}

	if (!config.jwt) {
		return response.status(500).json({ success: false, message: "Серверная ошибка" })
	}

	try {
		const decodedToken = jwt.verify(token, config.jwt, {
			algorithms: ["HS256"],
		}) as DecodedToken

		if (!decodedToken._id) {
			return response
				.status(401)
				.json({ success: false, message: "Отсутствует идентификатор пользователя в токене" })
		}

		const userId = decodedToken._id

		const user = await User.findOne({ _id: userId })

		if (!user) {
			return response.status(404).json({ success: false, message: "Пользователь не найден" })
		}

		const deleteResult = await RefreshToken.deleteMany({
			userId,
			token: { $ne: token },
		})

		if (deleteResult.deletedCount > 0) {
			return response.status(200).json({ success: true, message: "Другие токены пользователя успешно удалены" })
		} else {
			return response.status(404).json({ success: false, message: "Токены для удаления не найдены" })
		}
	} catch (error) {
		return response.status(401).json({ success: false, message: "Неверный токен или неверный формат токена" })
	}
}

// Закрытие текущей сессии
export const postLogout = async (request: Request, response: Response) => {
	const { token } = request.body

	if (!token) {
		return response.status(400).json({ success: false, message: "Refresh токен не был предоставлен" })
	}

	if (!config.jwt) {
		return response.status(500).json({ success: false, message: "Серверная ошибка" })
	}

	try {
		const decodedToken = jwt.verify(token, config.jwt, {
			algorithms: ["HS256"],
		}) as DecodedToken

		const userId = decodedToken._id

		const user = await User.findOne({ _id: userId })

		if (!user) {
			return response.status(404).json({ success: false, message: "Пользователь не найден" })
		}

		const deleteResult = await RefreshToken.deleteMany({
			userId,
			token: { $eq: token },
		})
		if (deleteResult.deletedCount > 0) {
			return response.status(200).json({ success: true, message: "Текущая сессия успешно закрыта" })
		} else {
			return response.status(404).json({ success: false, message: "Текущая сессия не найдена" })
		}
	} catch (error) {
		return response.status(500).json({ success: false, message: "Ошибка при закрытии текущей сессии" })
	}
}
