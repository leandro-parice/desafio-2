import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function authRoutes(app: FastifyInstance) {
  /// LOGIN
  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string().email(),
    })

    const { email } = loginBodySchema.parse(request.body)

    const user = await knex('users').where({ email }).select('id').first()

    if (user) {
      reply.cookie('userId', user.id, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // days
      })

      return reply.status(200).send()
    }

    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  })

  /// LOGOUT
  app.post('/logout', async (request, reply) => {
    reply.clearCookie('userId')
    return reply.status(200).send()
  })
}
