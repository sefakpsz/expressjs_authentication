import { connectToMongo } from './types/mongo'
import { connectToRedis } from './types/redis'

export const connectToDb = async () => {
    await connectToMongo()
    await connectToRedis()
}