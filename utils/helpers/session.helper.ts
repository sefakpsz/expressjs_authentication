import { redisServer } from "../../databases/types/redis.db"
import { IRedisResult } from "../../types/auth.types"

export const setUserSession = async (userId: string, ip: string, token: string): Promise<Boolean> => {
    const date = new Date()
    const session = {
        token,
        expireDate: date.setHours(date.getHours() + 72)
    }

    await redisServer.hSet("Sessions", `${userId}_${ip}`, JSON.stringify(session))
        .catch(err => {
            console.error(err)
            return false
        })

    return true
}

export const getUserSession = async (userId: string, ip: string) => {
    const redisResponse = await redisServer.hGet("Sessions", `${userId}_${ip}`)
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
    redisServer.hgetall
}