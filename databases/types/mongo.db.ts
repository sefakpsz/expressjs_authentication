import { connect } from "mongoose"

export const connectToMongo = async () => {
    await connect(process.env.mongoConnectionString as string)
        .then(() => {
            console.log(`Connected to MongoDb!`)
        })
        .catch((error) => {
            console.log(error.message)
            console.error(error)
            process.exit();
        })
}