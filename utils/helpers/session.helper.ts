import { redisServer } from "../../databases/types/redis.db"
import { IRedisResult } from "../../types/auth.types"

export const setUserSession = async (userId: string, ip: string, token: string): Promise<Boolean> => {
    const date = new Date()
    const session = {
        token,
        expireDate: date.setHours(date.getHours() + 72)
    }

    const redisHashName = process.env.redisHashName as string

    await redisServer.hSet(redisHashName, `${userId}_${ip}`, JSON.stringify(session))
        .catch(err => {
            console.error(err)
            return false
        })

    return true
}

export const getUserSession = async (userId: string, ip: string) => {
    const redisHashName = process.env.redisHashName as string

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
    const redisHashName = process.env.redisHashName as string

    let userSessions = await redisServer.hGetAll(redisHashName)

    const userSessionsJSON = JSON.parse(JSON.stringify(userSessions)) as [IRedisResult]

    const emptySession = { token: "", expireDate: "" } as IRedisResult

    userSessionsJSON.forEach(async session => {
        let sessionUserId = session.toString().split('_')[0]
        if (userId === sessionUserId)
            await redisServer.hSet(redisHashName, session.toString(), JSON.stringify(emptySession))
    })
}

export const clearUserSession = async (userId: string, ip: string) => {
    const session = { token: "", expireDate: "" } as IRedisResult

    const redisHashName = process.env.redisHashName as string

    await redisServer.hSet(redisHashName, `${userId}_${ip}`, JSON.stringify(session))
}