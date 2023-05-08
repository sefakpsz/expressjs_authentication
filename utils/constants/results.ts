import express from 'express'

const res = express.response;

export const successResult = (data: object | string | null, message: string) => {
    res.json({
        success: false,
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