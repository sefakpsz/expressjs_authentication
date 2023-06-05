declare global {
    namespace Express {
        export interface Request {
            user: {
                userId: string | Number,
                email: string
            }
        }
        export interface Response {
            user: {
                userId: string | Number,
                email: string
            }
        }
    }
}

export { }