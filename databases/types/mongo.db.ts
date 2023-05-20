import { connect } from "mongoose"

export const connectToMongo = async () => {
    await connect(process.env.mongoConnectionStringDocker as string)
        .then(() => {
            console.log(`Connected to MongoDb!`)
        })
        .catch((error) => {
            console.log(error.message, "ALŞSKDJFŞLASJDFŞLS")
            console.error(error)
            process.exit();
        })
}