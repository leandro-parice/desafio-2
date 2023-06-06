import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { userRoutes } from './routes/userRoutes'
import { mealRoutes } from './routes/mealRoutes'

const app = fastify()

app.register(cookie)

app.register(userRoutes, { prefix: 'users' })
app.register(mealRoutes, { prefix: 'meals' })

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
