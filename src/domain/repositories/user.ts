import { Schema, model } from "mongoose"

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		login: { type: String, required: true, unique: true },
		url: { type: String, required: false },
		email: { type: String, required: true, unique: true },
	},
	{ timestamps: true },
)

// Generate URL based on user's login
userSchema.pre("save", function (next) {
	if (!this.url) {
		this.url = `/users/${this.login}`
	}
	next()
})

export const User = model("User", userSchema)
