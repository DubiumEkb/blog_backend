import jwt from "jsonwebtoken"

import config from "../../config/"

export const generateAccessToken = (userId: string): string => {
	const jwtSecret = config.jwt
	if (!jwtSecret) {
		throw new Error("Секрет JWT не найден в конфигурации")
	}
	return jwt.sign({ _id: userId }, jwtSecret, { expiresIn: "15m" })
}

export const generateRefreshToken = (userId: string): string => {
	const jwtSecret = config.jwt
	if (!jwtSecret) {
		throw new Error("Секрет JWT не найден в конфигурации")
	}
	return jwt.sign({ _id: userId }, jwtSecret, { expiresIn: "7d" })
}
