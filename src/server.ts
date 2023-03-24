import cookieParser from "cookie-parser"
import cors from "cors"
import express, { Express } from "express"
import mongoose from "mongoose"
import open from "open"

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

app.use("/v1", Routes)

let browserOpened = false

const start = async () => {
	try {
		await mongoose.connect(config.dbUrl || "")

		const server = app.listen(config.port, () => {
			console.log(`⚡️[server]: Server is running at ${config.apiUrl}:${config.port}`)

			if (!browserOpened) {
				// open(`${config.apiUrl}:${config.port}`)
				browserOpened = true
			}
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
