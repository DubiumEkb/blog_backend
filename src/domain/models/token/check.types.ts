import { JwtPayload } from "jsonwebtoken"

export interface DecodedToken extends JwtPayload {
	_id: string
}
