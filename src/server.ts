import cookieParser from "cookie-parser"
import cors from "cors"
import express, { Express, NextFunction, Request, Response } from "express"
import mongoose from "mongoose"

import { Routes } from "./application/routes/index"
import config from "./config/index"

const app: Express = express()

app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		credentials: true,
		methods: ["OPTIONS", "GET", "POST", "PATCH", "DELETE"],
		// origin: config.clientUrl,
	}),
)
app.use((request: Request, response: Response, next: NextFunction) => {
	response.setHeader("X-Frame-Options", "SAMEORIGIN")
	// if (config.clientUrl) {
	// 	response.setHeader("Access-Control-Allow-Origin", config.clientUrl)
	// }
	response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH, DELETE")
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	response.setHeader("Access-Control-Allow-Credentials", "true")
	next()
})

app.use("/v1", Routes)

app.use("*", (request: Request, response: Response) => {
	response.send("Не найдено")
})

const start = async () => {
	try {
		await mongoose.connect(config.dbUrl || "")

		const server = app.listen(config.port, () => {
			console.log(`⚡️[server]: Server is running at ${config.apiUrl}:${config.port}`)
		})

		process.on("SIGTERM", () => {
			console.log("SIGTERM signal received: closing HTTP server")

			server.close(() => {
				console.log("HTTP server closed")
			})
		})
	} catch (error) {
		console.error(error)
	}
}

start()
