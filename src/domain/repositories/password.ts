import { Schema, model } from "mongoose"

const passwordSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User" },
	password: { type: String, required: true },
})

export const Password = model("Password", passwordSchema)
