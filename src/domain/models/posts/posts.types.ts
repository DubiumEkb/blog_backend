export interface ITag {
	_id: string
	name: string
	url: string
	status: boolean
}

export interface IUser {
	_id: string
	login: string
	image: string
	url: string
}

export interface IPost {
	_id: string
	title: string
	postUrl: string
	previewDescription: object
	content: object
	type: {
		name: string
		url: string
	}
	tags: ITag[]
	typeCard: string
	cover: {
		url: string
		alt: string
	}
	author: IUser
	createdAt: Date
	updatedAt: Date
	status: boolean
}

export interface IGetAllPosts {
	_limit?: string
	_page?: string
}

export interface IGetAllPostsResponseData {
	success: boolean
	data?: IPost[]
	count?: number
	error?: string | undefined
}
