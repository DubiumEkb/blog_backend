import { Schema, model } from "mongoose"

interface IRefreshToken {
	token: string
	userId: string
	expires: Date
}

const refreshTokenSchema = new Schema({
	// refresh токен
	token: { type: String, required: true },
	// идентификатор пользователя, которому принадлежит токен
	userId: { type: Schema.Types.ObjectId, required: true },
	// дата и время истечения срока действия токена
	expires: { type: Date, required: true },
})

export const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema)
