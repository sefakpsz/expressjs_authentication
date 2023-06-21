import { HttpStatusCode } from 'axios'
import express from 'express'

const res = express.response

export const successResult = (data: object | string | number | Boolean | null, message: string) => {
    return {
        success: true,
        data,
        message
    }
}

export const errorResult = (data: object | string | number | Boolean | null, message: string) => {
    return {
        success: false,
        data,
        message
    }
}

export const unknownErrorResult = () => {
    (error: Error) => {
        return res.status(HttpStatusCode.BadRequest).json(
            errorResult(
                null,
                error.message
            )
        )
    }
}