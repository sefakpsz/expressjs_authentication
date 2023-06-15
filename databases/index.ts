import { connectToMongo } from './types/mongo.db'
import { connectToRedis } from './types/redis.db'

export const connectToDb = async () => {
    await connectToMongo()
    await connectToRedis()
}