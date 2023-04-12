import { Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import config from "../../../config"
import { User } from "../../../domain/repositories/user"

export const getUser = async (request: Request, response: Response) => {
	try {
		const accessToken = request.headers.authorization?.split(" ")[1]

		if (!accessToken) {
			return response.status(401).json({ success: false, message: "Access token is missing" })
		}

		const { _id: userId } = jwt.verify(accessToken, config.jwt || "") as JwtPayload

		const user = await User.findById(userId)

		if (!user) {
			return response.status(404).json({ success: false, message: "User not found" })
		}

		return response.json({ success: true, user })
	} catch (error) {
		console.error("Error in getUser:", error)
		return response.status(500).json({ success: false, message: "Server error" })
	}
}
