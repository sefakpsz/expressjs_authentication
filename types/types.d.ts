import { IUser } from "./auth.types"

declare global {
    namespace Express {
        export interface Request {
            user: IUser
        }
        export interface Response {
            user: IUser
        }
    }
}

export { }