import { Request, Response } from "express"

const GET = async (request: Request, response: Response): Promise<void> => {
	try {
		response.json({ message: "Hello World!" })
	} catch (error) {
		console.error(error)
		response.status(500).json({ error: "Server error" })
	}
}

export default {
	GET,
}
