export interface IUser {
	name: string
	login: string
	email: string
}

export interface IPassword {
	user: string
	password: string
}

export interface ILogin {
	login: string
	password: string
}
