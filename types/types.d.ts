declare global {
    namespace Express {
        export interface Request {
            user: {
                userId: String | Number,
                email: String
            }
        }
        export interface Response {
            user: {
                userId: String | Number,
                email: String
            }
        }
    }
}

export { }