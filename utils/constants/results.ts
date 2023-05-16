import { HttpStatusCode } from 'axios';
import express from 'express'

const res = express.response;

export const successResult = (data: object | string | null, message: string) => {
    res.json({
        success: true,
        data,
        message
    })
}

export const errorResult = (data: object | string | null, message: string) => {
    res.json({
        success: false,
        data,
        message
    })
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