import { connectToMongo } from './types/mongo.db'

export const connectToDb = async () => {
    await connectToMongo();
}