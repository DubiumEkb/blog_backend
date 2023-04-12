import { config } from "dotenv"

if (process.env.NODE_ENV === "production") {
	config({ path: `${__dirname}/env/production.env` })
} else {
	config({ path: `${__dirname}/env/development.env` })
}

export default {
	dbUrl: process.env.DB_URL,
	apiUrl: process.env.API_URL,
	clientUrl: process.env.CLIENT_URL,
	port: parseInt(process.env.PORT || "5000", 10),
	jwt: process.env.JWT_SECRET,
}
