import express from 'express'

const res = express.response;

export const successDataResult = (message: string, data: object) => {
    res.json({
        success: false,
        data,
        message
    })
}

export const errorDataResult = (message: string, data: object) => {
    res.json({
        success: false,
        data,
        message
    })
}

export const successResult = (message: string) => {
    res.json({
        success: false,
        message
    })
}

export const errorResult = (message: string) => {
    res.json({
        success: false,
        message
    })
}