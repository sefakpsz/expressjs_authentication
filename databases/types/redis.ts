import { RedisClientType, createClient } from 'redis'

export let redisServer: RedisClientType
export const connectToRedis = async () => {
  redisServer = createClient({
    url: '127.0.0.1:6379',
  })

  redisServer.on('error', (err) => console.log('Redis Client Error', err))

  await redisServer
    .connect()
    .then(() => {
      console.log('Connected To Redis!')
    })
    .catch((error) => {
      console.log(error.message)
      console.error(error)
      process.exit()
    })
}
