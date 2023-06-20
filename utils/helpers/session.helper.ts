import { redisServer } from "../../databases/types/redis"
import { IRedisResult } from "../../types/auth.types"
import { Request } from 'express'

const redisHashName = process.env.redisHashName as string

export const setUserSession = async (req: Request, userId: string, token: string): Promise<Boolean> => {
    const date = new Date()
    const session = {
        token,
        expireDate: date.setHours(date.getHours() + 72)
    }

    const ip = getIP(req.ip.toString())

    await redisServer.hSet(redisHashName, `${userId}_${ip}`, JSON.stringify(session))
        .catch(err => {
            console.error(err)
            return false
        })

    return true
}

export const getUserSession = async (req: Request, userId: string) => {
    const ip = getIP(req.ip.toString())

    const redisResponse = await redisServer.hGet(redisHashName, `${userId}_${ip}`)
        .catch(err => {
            console.error(err)
            return false
        })

    if (!redisResponse) {
        return false
    }

    const userSession = JSON.parse(
        redisResponse as string
    ) as IRedisResult

    return userSession
}

export const clearUserSessions = async (userId: string) => {
    let userSessions = await redisServer.hKeys(redisHashName)

    const emptySession = { token: "", expireDate: "" } as IRedisResult

    userSessions.forEach(async session => {
        if (session.includes(userId))
            await redisServer.hSet(redisHashName, session, JSON.stringify(emptySession))
    })
}

export const clearUserSession = async (req: Request, userId: string) => {
    const session = { token: "", expireDate: "" } as IRedisResult

    const ip = getIP(req.ip.toString())

    await redisServer.hSet(redisHashName, `${userId}_${ip}`, JSON.stringify(session))
}

const getIP = (ip: string) => {
    return ip.split(':').slice(-1).toString()
    // req.headers['x-forwarded-for'].tos ||
    // req.header('x-forwarded-for')
}