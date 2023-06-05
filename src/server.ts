import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes'
import { mealRoutes } from './routes/mealRoutes'
import { env } from './env'

const app = fastify()

app.register(userRoutes, { prefix: 'user' })
app.register(mealRoutes, { prefix: 'meal' })

app.get('/', () => {
  return 'Http server!'
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
