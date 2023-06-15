import { redisServer } from "../../databases/types/redis.db"
import { IRedisResult } from "../../types/auth.types"

export const setUserSession = async (userId: string, ip: string, token: string): Promise<Boolean> => {
    const date = new Date()
    const session = {
        token,
        expireDate: date.setHours(date.getHours() + 72)
    }

    await redisServer.hSet("Sessions", `${userId}_${ip}`, JSON.stringify(session))

    return true
}

export const getUserSession = async (userId: string, ip: string): Promise<IRedisResult> => {
    const userSession = JSON.parse(
        (await redisServer.hGet("Sessions", `${userId}_${ip}`)) || ""
    ) as IRedisResult

    return userSession
}

export const getSession = async () => {

}