import { connect } from "mongoose"

export const connectToMongo = async () => {
    await connect(`${process.env.mongoConnectionString}`)
        .then(() => {
            console.log(`Connected to MongoDb!`)
        })
        .catch((error) => {
            console.error(error)
            process.exit();
        })
}